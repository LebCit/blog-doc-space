import { sitemap } from "../functions/sitemap.js"
import { getSettings } from "../functions/settings.js"
import { initializeApp } from "../functions/initialize.js"

const { eta } = initializeApp()

// Sitemap Route
export function sitemapRoute(app) {
	app.get("/sitemap", async (req, res) => {
		const settings = await getSettings()

		const response = eta.render(`themes/${settings.currentTheme}/layouts/sitemap.html`, {
			urls: await sitemap(),
		})
		res.setHeader("Content-Type", "text/xml")
		res.end(response)
	})
}
