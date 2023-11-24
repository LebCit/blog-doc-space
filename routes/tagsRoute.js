import { postsByTagCount, postsByTagList } from "../functions/blog-doc.js"
import { initializeApp } from "../functions/initialize.js"
import { getSettings } from "../functions/settings.js"

const { eta } = initializeApp()

// TAGS ROUTE
export async function tagsRoute(app) {
	app.get("/tags", async (req, res) => {
		const settings = await getSettings()

		// Tags Route data
		const data = {
			title: "Tags",
			description: "A list of all the tags",
			featuredImage: settings.tagsImage,
		}
		const response = eta.render(`themes/${settings.currentTheme}/layouts/base.html`, {
			// Passing Route data
			tagsRoute: true,
			// Passing document data
			data: data,
			posts: await postsByTagCount(),
			// Passing needed settings for the template
			siteTitle: settings.siteTitle,
			menuLinks: settings.menuLinks,
			footerCopyright: settings.footerCopyright,
		})
		res.writeHead(200, { "Content-Type": "text/html" })
		res.end(response)
	}).get("/tags/:tag", async (req, res) => {
		const settings = await getSettings()

		// Dynamic parameter
		const { tag } = req.params
		// List of posts matching the `:tag` request parameter
		const postsByTag = await postsByTagList(tag)

		if (postsByTag.length) {
			// Tag Route data
			const data = {
				title: postsByTag.length > 1 ? `Posts Tagged "${tag}"` : `Post Tagged "${tag}"`,
				description: `List of posts tagged ${tag}`,
				featuredImage: settings.tagImage,
				subTitle: postsByTag.length > 1 ? `${postsByTag.length} posts with this tag` : `1 post with this tag`,
			}
			const response = eta.render(`themes/${settings.currentTheme}/layouts/base.html`, {
				// Passing Route data
				tagRoute: true,
				// Passing document data
				data: data,
				posts: postsByTag,
				paginated: false,
				// Passing document image data
				postPreviewFallbackImage: settings.postPreviewFallbackImage,
				// Passing needed settings for the template
				siteTitle: settings.siteTitle,
				menuLinks: settings.menuLinks,
				footerCopyright: settings.footerCopyright,
			})
			res.writeHead(200, { "Content-Type": "text/html" })
			res.end(response)
		} else {
			// Proceed to the 404 route if no tag is found
			res.writeHead(302, { Location: "/404" })
			res.end()
			return
		}
	})
}
