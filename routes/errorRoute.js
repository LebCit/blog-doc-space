import { initializeApp } from "../functions/initialize.js"
import { getSettings } from "../functions/settings.js"

const { eta } = initializeApp()

export function errorRoute(app) {
	// 404 Route
	app.get("/404", async (req, res) => {
		const settings = await getSettings()

		const data = {
			title: "Page Not Found",
			description: "The server cannot find the requested resource",
			subTitle: "Nothing to land on here !",
			favicon: settings.favicon,
		}
		const response = eta.render(`themes/${settings.currentTheme}/layouts/base.html`, {
			// Passing Route data
			errorRoute: true,
			// Passing document data
			data: data,
			// Passing document image data
			imageSrc: "/static/images/404-not-found-error.png",
			imageAlt: "Sailor on a 404 mast looking out to sea",
			// Passing needed settings for the template
			siteTitle: settings.siteTitle,
			menuLinks: settings.menuLinks,
			footerCopyright: settings.footerCopyright,
		})
		res.writeHead(404, { "Content-Type": "text/html" })
		res.end(response)
		return
	})

	// 500 Route
	app.get("/500", async (req, res) => {
		const settings = await getSettings()

		const data = {
			title: "Internal Server Error",
			description: "The server encountered an unexpected condition that prevented it from fulfilling the request",
			subTitle: "Server is on a break here !",
			favicon: settings.favicon,
		}
		const response = eta.render(`themes/${settings.currentTheme}/layouts/base.html`, {
			// Passing Route data
			errorRoute: true,
			// Passing document data
			data: data,
			// Passing document image data
			imageSrc: "/static/images/500-internal-server-error.png",
			imageAlt: "Sad robot in front of empty box",
			// Passing needed settings for the template
			siteTitle: settings.siteTitle,
			menuLinks: settings.menuLinks,
			footerCopyright: settings.footerCopyright,
		})
		res.writeHead(500, { "Content-Type": "text/html" })
		res.end(response)
		return
	})
}
