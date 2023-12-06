import { getPosts } from "../functions/blog-doc.js"
import { getSettings } from "../functions/settings.js"
import { initializeApp } from "../functions/initialize.js"

const { eta } = initializeApp()

// RSS Route
export function rssRoute(app) {
	app.get("/rss", async (req, res) => {
		const settings = await getSettings()

		// Get the posts array
		const posts = (await getPosts()).filter((post) => post[1].frontmatter.published == "true")

		const response = eta.render(`themes/${settings.currentTheme}/layouts/rss.html`, {
			// Passing needed settings for the template
			siteTitle: settings.siteTitle,
			siteDescription: settings.siteDescription,
			siteURL: settings.siteURL,
			rssSiteLanguage: settings.rssSiteLanguage,
			rssCopyright: settings.rssCopyright,
			posts: posts,
		})
		res.setHeader("Content-Type", "text/xml")
		res.end(response)
	})
}
