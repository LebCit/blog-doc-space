import util from "util"
import * as fs from "node:fs"
import ejs from "ejs"
import matter from "gray-matter"
import markdownIt from "markdown-it"
import markdownItPrism from "markdown-it-prism"

// Promisify
const mkdir = util.promisify(fs.mkdir)
const delDir = util.promisify(fs.rm)
const copyDir = util.promisify(fs.cp)
const writeFile = util.promisify(fs.writeFile)
const readFile = util.promisify(fs.readFile)

// Functions
import { getFiles } from "./getFiles.js"
import { getPosts } from "./getPosts.js"
import { paginator } from "./paginator.js"
import { postsByTagCount } from "./postsByTagCount.js"
import { postsByTagList } from "./postsByTagList.js"
import { sitemap } from "./sitemap.js"
import { idsInHeadings } from "./idsInHeadings.js"

const viewsFiles = await getFiles("views")
const posts = await getPosts()

// Settings
import { settings } from "../config/settings.js"
const {
	siteTitle,
	siteURL,
	siteDescription,
	featuredImage,
	postsPerPage,
	postPreviewFallbackImage,
	rssSiteLanguage,
	rssCopyright,
	menuLinks,
	searchFeature,
	addIdsToHeadings,
	footerCopyright,
} = settings

// Remove admin link from menu
delete menuLinks.admin

async function build() {
	if (fs.existsSync("_site")) {
		await delDir("_site", { recursive: true })
	}

	try {
		// Create output directory
		await mkdir("_site", { recursive: true })
		await mkdir("_site/page", { recursive: true })
		await mkdir("_site/pages", { recursive: true })
		await mkdir("_site/posts", { recursive: true })
		await mkdir("_site/tags", { recursive: true })
		await mkdir("_site/search", { recursive: true })

		// Copy public folder to _site
		await copyDir("public", "_site", { recursive: true })

		// Delete the admin folder in _site
		await delDir("_site/admin", { recursive: true })

		// FILES ROUTE
		const files = viewsFiles.filter(
			(path) => !path.startsWith("views/components") && !path.startsWith("views/layouts")
		)
		files.forEach(async (file) => {
			// Get each file name
			const fileWithoutExtension = file
				.split("/")
				.pop()
				.replace(/\.[^/.]+$/, "")
			// Markdown Files Logic
			if (file?.endsWith(".md")) {
				// Read the Markdown file and parse it's front matter
				const mdFile = matter.read(file)

				// Convert the Markdown file content to HTML with markdown-it
				// Allows HTML tags inside the Markdown file, use prism.js with markdown-it and highlight inline code
				const md = markdownIt({ html: true }).use(markdownItPrism, { highlightInlineCode: true })
				const content = mdFile.content // Read the Markdown file content
				const html = md.render(content) // Convert the Markdown file content to HTML

				const titles = {
					siteTitle: siteTitle,
					docTitle: mdFile.data.title,
					docDescription: mdFile.data.description,
				}

				if (file?.startsWith("views/pages/")) {
					// Create a folder for each page
					await mkdir(`_site/pages/${fileWithoutExtension}`, { recursive: true })

					const pageHTML = await ejs.renderFile("views/layouts/base.ejs", {
						mdRoute: true,
						page: true,
						links: menuLinks,
						titles: titles,
						htmlContent: addIdsToHeadings ? idsInHeadings(html) : html,
						featuredImage: mdFile.data.featuredImage,
						footerCopyright: footerCopyright,
					})
					// Create html file out of each Markdown page.
					await writeFile(`_site/pages/${fileWithoutExtension}/index.html`, pageHTML, "utf8")
				} else {
					const actualPostIndex = posts.findIndex((post) => post[0] === `${fileWithoutExtension}.md`)
					const previousPostIndex = actualPostIndex < posts.length - 1 ? actualPostIndex + 1 : null
					const nextPostIndex = actualPostIndex > 0 ? actualPostIndex - 1 : null
					const previousPost =
						previousPostIndex !== null ? posts[previousPostIndex][0].replace(".md", "") : null
					const nextPost = nextPostIndex !== null ? posts[nextPostIndex][0].replace(".md", "") : null
					const previousPostTitle = previousPostIndex !== null ? posts[previousPostIndex][1].data.title : null
					const nextPostTitle = nextPostIndex !== null ? posts[nextPostIndex][1].data.title : null

					const relatedPostsArray = mdFile.data.relatedPosts
					let relatedPosts = []
					if (relatedPostsArray) {
						relatedPostsArray.forEach((relatedPost) => {
							relatedPost = posts.filter((post) => post[0] === `${relatedPost}.md`)
							relatedPosts.push(relatedPost)
						})
					}

					// Create a folder for each post
					await mkdir(`_site/posts/${fileWithoutExtension}`, { recursive: true })

					const postHTML = await ejs.renderFile("views/layouts/base.ejs", {
						mdRoute: true,
						post: true,
						links: menuLinks,
						titles: titles,
						date: mdFile.data.date,
						featuredImage: mdFile.data.featuredImage,
						tags: mdFile.data.tags,
						htmlContent: addIdsToHeadings ? idsInHeadings(html) : html,
						previousPost: previousPost,
						nextPost: nextPost,
						previousPostTitle: previousPostTitle,
						nextPostTitle: nextPostTitle,
						relatedPosts: relatedPosts ? relatedPosts.flatMap((x) => x) : relatedPosts,
						footerCopyright: footerCopyright,
					})
					// Create html file out of each Markdown post.
					await writeFile(`_site/posts/${fileWithoutExtension}/index.html`, postHTML, "utf8")
				}
			} else if (file.startsWith("views/templates/")) {
				// EJS Files Logic
				const templateHTML = await ejs.renderFile(file, {
					titles: { siteTitle: siteTitle },
					links: menuLinks,
					footerCopyright: footerCopyright,
				})
				const newTemplateHTML = newHTML(templateHTML)
				// Create html file out of each EJS template.
				await writeFile(`_site/${fileWithoutExtension}.html`, newTemplateHTML, "utf8")
			}
		})

		// MAIN ROUTE
		async function mainRoute() {
			const paginatedPosts = paginator(posts, 1, postsPerPage)
			const newestPosts = paginatedPosts.data
			const lastPage = paginatedPosts.total_pages - 1
			const postsLength = paginatedPosts.total

			const titles = {
				siteTitle: siteTitle,
				docTitle: "Home",
				docDescription: siteDescription,
			}

			const indexHTML = await ejs.renderFile("views/layouts/base.ejs", {
				mainRoute: true,
				links: menuLinks,
				titles: titles,
				posts: newestPosts,
				firstPage: true,
				lastPage: lastPage,
				paginated: postsLength > postsPerPage ? true : false,
				featuredImage: featuredImage,
				postPreviewFallbackImage: postPreviewFallbackImage,
				footerCopyright: footerCopyright,
			})
			// Create html file for the main route.
			await writeFile(`_site/index.html`, indexHTML, "utf8") // PROBLEM !!!

			// DYNAMIC MAIN ROUTE
			for (let i = 1; i <= lastPage; i++) {
				// Create a folder for each page of the blog
				await mkdir(`_site/page/${i}`, { recursive: true })

				// Paginated array from the list of posts without the newest X posts
				const paginatedPostsList = paginator(posts.slice(postsPerPage), i, postsPerPage)

				const dynamicIndexHTML = await ejs.renderFile("views/layouts/base.ejs", {
					mainRoute: true,
					links: menuLinks,
					titles: titles,
					posts: paginatedPostsList.data,
					paginatedPostsList: paginatedPostsList,
					firstPage: false,
					lastPage: lastPage,
					paginated: true, // To display the pagination component on each blog page route
					featuredImage: featuredImage,
					postPreviewFallbackImage: postPreviewFallbackImage,
					footerCopyright: footerCopyright,
				})
				// Create html file for each page after the main route.
				await writeFile(`_site/page/${i}/index.html`, dynamicIndexHTML, "utf8")
			}
		}
		mainRoute()

		// ARCHIVE ROUTE
		async function archiveRoute() {
			const titles = {
				siteTitle: siteTitle,
				docTitle: "Archive",
				docDescription: "A list of all the posts",
			}

			const archiveHTML = await ejs.renderFile("views/layouts/base.ejs", {
				archiveRoute: true,
				links: menuLinks,
				titles: titles,
				posts: posts,
				paginated: false, // To hide the pagination component on the archive route.
				postPreviewFallbackImage: postPreviewFallbackImage,
				footerCopyright: footerCopyright,
			})
			// Create html file for the archive route.
			await writeFile(`_site/posts/index.html`, archiveHTML, "utf8")
		}
		archiveRoute()

		// TAGS ROUTE
		async function tagsRoute() {
			const titles = {
				siteTitle: siteTitle,
				docTitle: "Tags",
				docDescription: "A list of all the tags",
			}

			const tagsHTML = await ejs.renderFile("views/layouts/base.ejs", {
				tagsRoute: true,
				links: menuLinks,
				titles: titles,
				postsByTagCount: postsByTagCount(),
				featuredImage: "/images/pile-of-assorted-color-papers-photo.avif",
				footerCopyright: footerCopyright,
			})
			// Create html file for the tags route.
			await writeFile(`_site/tags/index.html`, tagsHTML, "utf8")
		}
		tagsRoute()

		// DYNAMIC ROUTE FOR EACH TAG
		async function tagRoute() {
			const allTagsArray = posts.flatMap((post) => post[1].data.tags).sort()

			// Remove duplicates from tagsArray using a Set
			const tagsArray = [...new Set(allTagsArray)]

			tagsArray.forEach(async (tag) => {
				// If tag is not undefined
				if (tag) {
					// Create a folder for each tag
					await mkdir(`_site/tags/${tag}`, { recursive: true })

					const postsByTag = postsByTagList(tag)

					const titles = {
						siteTitle: siteTitle,
						docTitle: postsByTag.length > 1 ? `Posts Tagged "${tag}"` : `Post Tagged "${tag}"`,
						docDescription: `List of posts tagged ${tag}`,
						subTitle:
							postsByTag.length > 1 ? `${postsByTag.length} posts with this tag` : "1 post with this tag",
					}

					const tagHTML = await ejs.renderFile("views/layouts/base.ejs", {
						tagRoute: true,
						links: menuLinks,
						titles: titles,
						posts: postsByTag,
						paginated: false, // To hide the pagination component on any requested tag route
						postPreviewFallbackImage: postPreviewFallbackImage,
						footerCopyright: footerCopyright,
					})
					// Create html file for each tag.
					await writeFile(`_site/tags/${tag}/index.html`, tagHTML, "utf8")
				}
			})
		}
		tagRoute()

		// RSS ROUTE
		async function rssRoute() {
			const rssXML = await ejs.renderFile("views/layouts/rss.ejs", {
				siteTitle: siteTitle,
				siteDescription: siteDescription,
				siteURL: siteURL,
				rssSiteLanguage: rssSiteLanguage,
				rssCopyright: rssCopyright,
				posts: posts,
			})
			// Create xml file for the RSS feed.
			await writeFile(`_site/rss.xml`, rssXML, "utf8")
		}
		rssRoute()

		// SITEMAP ROUTE
		async function sitemapRoute() {
			const sitemapXML = await ejs.renderFile("views/layouts/sitemap.ejs", {
				urls: sitemap(),
			})
			// Create xml file for the sitemap.
			await writeFile(`_site/sitemap.xml`, sitemapXML, "utf8")
		}
		sitemapRoute()

		// SEARCH ROUTE
		async function search() {
			let allPosts = posts
			allPosts.forEach((post) => {
				delete post.date
				delete post[1].excerpt
				delete post[1].isEmpty
				delete post[1].path
				delete post[1].orig
			})
			const postsJSON = JSON.stringify(allPosts)
			await writeFile(`_site/js/posts.json`, postsJSON, "utf8")

			const searchFile = await readFile("functions/search.js")
			const searchString = searchFile.toString()
			await writeFile("_site/js/search.js", searchString, "utf8")

			const titles = {
				siteTitle: siteTitle,
				docTitle: "Search",
				docDescription: "Make a research in the site's posts",
			}

			const searchHTML = await ejs.renderFile("views/layouts/base.ejs", {
				build: true,
				searchRoute: true,
				links: menuLinks,
				titles: titles,
				postPreviewFallbackImage: postPreviewFallbackImage,
				footerCopyright: footerCopyright,
			})
			// Create html file for the search route.
			await writeFile(`_site/search/index.html`, searchHTML, "utf8")
		}
		if (searchFeature) search()
	} catch (error) {
		console.log(error)
	}
}
build()
