import { Router } from "express"
const router = Router()

import { dirname } from "path"
import { fileURLToPath } from "url"
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import matter from "gray-matter"
import markdownIt from "markdown-it"
import markdownItPrism from "markdown-it-prism"
import { getFiles } from "../functions/getFiles.js"
import { getPosts } from "../functions/getPosts.js"
import { idsInHeadings } from "../functions/idsInHeadings.js"

const viewsFiles = await getFiles("views")
const posts = await getPosts()

// Settings
import { settings } from "../config/settings.js"
const { siteTitle, menuLinks, footerCopyright, addIdsToHeadings } = settings

const files = viewsFiles.filter((path) => !path.startsWith("views/components") && !path.startsWith("views/layouts"))

// Using a route parameter to render each post/page/template on a route matching it's filename
export const filesRoute = router.get("/:folder/:filename", (req, res) => {
	// Get the file by searching in the files array for a file matching the request parameters and any extension
	const fileWithExtension = files.find(
		(file) => file === `views/${req.params.folder}/${req.params.filename + file.match(/\.[0-9a-z]+$/i)[0]}`
	)
	// Get the path of that fileWithExtension by searching in the files array
	const path = files.find((file) => file.endsWith(fileWithExtension))

	// Markdown Files Logic
	if (fileWithExtension?.endsWith(".md")) {
		// `?` optional chaining operator to check if the variable is not nullish before accessing it
		// Read the Markdown file and parse it's front matter
		const file = matter.read(`${__dirname}/../${path}`)

		// Convert the Markdown file content to HTML with markdown-it
		// Allows HTML tags inside the Markdown file, use prism.js with markdown-it and highlight inline code
		const md = markdownIt({ html: true }).use(markdownItPrism, { highlightInlineCode: true })
		const content = file.content // Read the Markdown file content
		const html = md.render(content) // Convert the Markdown file content to HTML

		const titles = {
			siteTitle: siteTitle,
			docTitle: file.data.title,
			docDescription: file.data.description,
		}

		if (path?.startsWith("views/pages/")) {
			// Render the pagesTemplate for each page and pass it's front matter as a data object into pagesTemplate
			res.render("layouts/base", {
				mdRoute: true,
				page: true,
				links: menuLinks,
				titles: titles,
				htmlContent: addIdsToHeadings ? idsInHeadings(html) : html,
				featuredImage: file.data.featuredImage,
				footerCopyright: footerCopyright,
			})
		} else {
			// Get the index of each post in the posts array by it's filename
			const actualPostIndex = posts.findIndex((post) => post[0] === `${req.params.filename}.md`)
			// Get the previous post index while the actual post index is smaller than the posts array length - 1 (posts array length - 1 is the index of the last post)
			const previousPostIndex = actualPostIndex < posts.length - 1 ? actualPostIndex + 1 : null
			// Get the next post index while the actual post index is greater than 0 (0 is the index of the first post)
			const nextPostIndex = actualPostIndex > 0 ? actualPostIndex - 1 : null
			// Get the previous post by it's index while it's not the last post or return null
			const previousPost = previousPostIndex !== null ? posts[previousPostIndex][0].replace(".md", "") : null
			// Get the next post by it's index while it's not the first post or return null
			const nextPost = nextPostIndex !== null ? posts[nextPostIndex][0].replace(".md", "") : null
			// Get the previous post title by it's index while it's not the last post or return null
			const previousPostTitle = previousPostIndex !== null ? posts[previousPostIndex][1].data.title : null
			// Get the next post title while it's not the first post or return null
			const nextPostTitle = nextPostIndex !== null ? posts[nextPostIndex][1].data.title : null
			// Get the related posts
			const relatedPostsArray = file.data.relatedPosts
			let relatedPosts = []
			if (relatedPostsArray) {
				relatedPostsArray.forEach((relatedPost) => {
					relatedPost = posts.filter((post) => post[0] === `${relatedPost}.md`)
					relatedPosts.push(relatedPost)
				})
			}

			// Render the postsTemplate for each post and pass it's front matter as a data object into postsTemplate
			res.render("layouts/base", {
				mdRoute: true,
				post: true,
				links: menuLinks,
				titles: titles,
				date: file.data.date,
				featuredImage: file.data.featuredImage,
				tags: file.data.tags,
				htmlContent: addIdsToHeadings ? idsInHeadings(html) : html,
				previousPost: previousPost,
				nextPost: nextPost,
				previousPostTitle: previousPostTitle,
				nextPostTitle: nextPostTitle,
				relatedPosts: relatedPosts ? relatedPosts.flatMap((x) => x) : relatedPosts,
				footerCopyright: footerCopyright,
			})
		}
	} else if (path?.startsWith("views/templates/")) {
		// Render the EJS template
		res.render(`templates/${fileWithExtension}`)
	} else {
		const titles = {
			siteTitle: siteTitle,
			docTitle: "Page Not Found",
			docDescription: "The server cannot find the requested resource",
			subTitle: "Nothing to land on here !",
		}
		// Render the 404 error page if no file in the pages, posts and templates sub-directories matches the filename request parameter
		res.status(404).render("layouts/base", {
			errorRoute: true,
			links: menuLinks,
			titles: titles,
			imageSrc: "/images/404-not-found-error.png",
			imageAlt: "Sailor on a 404 mast looking out to sea",
			footerCopyright: footerCopyright,
		})
	}
})
