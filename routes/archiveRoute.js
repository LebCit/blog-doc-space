import { initializeApp } from "../functions/initialize.js"
import { getSettings } from "../functions/settings.js"
import { getPosts } from "../functions/blog-doc.js"

const { eta } = initializeApp()

// Render all the posts from the list of posts on the Archive Route.
export function archiveRoute(app) {
	app.get("/posts", async (req, res) => {
		const settings = await getSettings()

		const posts = await getPosts()

		const data = {
			title: "Archive",
			description: "A list of all the posts",
			featuredImage: settings.archiveImage,
			favicon: settings.favicon,
		}
		const response = eta.render(`themes/${settings.currentTheme}/layouts/base.html`, {
			// Passing Route data
			archiveRoute: true,
			// Passing document data
			data: data,
			posts: posts,
			paginated: false, // To hide the pagination component on the archive route.
			// Passing document image data
			postPreviewFallbackImage: settings.postPreviewFallbackImage,
			// Passing needed settings for the template
			siteTitle: settings.siteTitle,
			menuLinks: settings.menuLinks,
			footerCopyright: settings.footerCopyright,
		})
		res.writeHead(200, { "Content-Type": "text/html" })
		res.end(response)
	})
}
