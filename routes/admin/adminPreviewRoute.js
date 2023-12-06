import { getPages, getPosts, prevNext } from "../../functions/blog-doc.js"
import { initializeApp } from "../../functions/initialize.js"
import { idsInHeadings } from "../../functions/helpers.js"
import { getSettings } from "../../functions/settings.js"
import { marked } from "marked"

const { eta } = initializeApp()

// Markdown Route
export function adminPreviewRoute(app) {
	/**
	 * Due to Velocy architecture, a route without a defined start point cannot be reached.
	 * This is why two routes are created, one for the pages and the other for posts.
	 * In short, the following route "/:folder/:filename" doesn't work in Velocy.
	 */
	app.get("/admin-preview-page/:filename", async (req, res) => {
		const settings = await getSettings()

		const pages = await getPages()
		const unpublishedPages = pages.filter((page) => page[1].frontmatter.published == "false")
		const currentFile = unpublishedPages.find((file) => file.path === `pages/${req.params.filename}.md`)

		if (currentFile) {
			const fileData = currentFile[1].frontmatter
			fileData.favicon = settings.favicon
			const fileContent = marked.parse(currentFile[1].content)
			const response = eta.render(`themes/${settings.currentTheme}/layouts/base.html`, {
				// Passing Route data
				mdRoute: true,
				// Passing Markdown file data
				data: fileData,
				content: settings.addIdsToHeadings ? idsInHeadings(fileContent) : fileContent,
				// Passing data to edit the file
				editable: true,
				filename: req.params.filename,
				// Passing needed settings for the template
				siteTitle: settings.siteTitle,
				menuLinks: settings.menuLinks,
				footerCopyright: settings.footerCopyright,
			})
			res.writeHead(200, { "Content-Type": "text/html" })
			res.end(response)
		} else {
			// Proceed to the 404 route if no file is found
			res.writeHead(302, { Location: "/404" })
			res.end()
		}
	})

	app.get("/admin-preview-post/:filename", async (req, res) => {
		const settings = await getSettings()

		const posts = await getPosts()
        const unpublishedPosts = posts.filter((post) => post[1].frontmatter.published == "false")
		const currentFile = unpublishedPosts.find((file) => file.path === `posts/${req.params.filename}.md`)

		if (currentFile) {
			const fileData = currentFile[1].frontmatter
			fileData.favicon = settings.favicon
			const fileContent = marked.parse(currentFile[1].content)
			const response = eta.render(`themes/${settings.currentTheme}/layouts/base.html`, {
				// Passing Route data
				mdRoute: true,
				// Passing Markdown file data
				data: fileData,
				content: settings.addIdsToHeadings ? idsInHeadings(fileContent) : fileContent,
				prevNext: currentFile.dir === "posts" ? await prevNext(`${req.params.filename}.md`) : null,
				// Passing data to edit the file
				editable: true,
				filename: req.params.filename,
				// Passing needed settings for the template
				siteTitle: settings.siteTitle,
				menuLinks: settings.menuLinks,
				footerCopyright: settings.footerCopyright,
			})
			res.writeHead(200, { "Content-Type": "text/html" })
			res.end(response)
		} else {
			// Proceed to the 404 route if no file is found
			res.writeHead(302, { Location: "/404" })
			res.end()
		}
	})
}
