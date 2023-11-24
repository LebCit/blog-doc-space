// Internal Functions
import { getImages, getSubDirs } from "../../functions/blog-doc.js"
import { initializeApp } from "../../functions/initialize.js"
import { transformParsedBody } from "../../functions/helpers.js"

const { eta } = initializeApp()

// Settings
import { getSettings } from "../../functions/settings.js"

import { formidable } from "formidable"

import { drive } from "../../functions/deta-drive.js"

// ROUTES TO MODIFY THE APP SETTINGS.
export const adminConfigRoute = (app) => {
	app.get("/admin-config-site", async (req, res) => {
		const settings = await getSettings()

		const data = {
			title: "Config Settings",
			description: `${settings.siteTitle} Site Settings`,
		}

		const response = eta.render("admin/layouts/adminConfigSite.html", {
			adminConfig: true,
			data: data,
			settings: settings,
			images: await getImages(),
			themes: await getSubDirs("views/themes"),
			siteTitle: settings.siteTitle,
			footerCopyright: settings.footerCopyright,
		})
		res.writeHead(200, { "Content-Type": "text/html" })
		res.end(response)
	})

		.get("/admin-config-menu", async (req, res) => {
			const settings = await getSettings()

			const data = {
				title: "Menu Settings",
				description: `${settings.siteTitle} Menu Settings`,
			}

			const response = eta.render("admin/layouts/adminConfigMenu.html", {
				adminConfig: true,
				data: data,
				settings: settings,
				images: await getImages(),
				siteTitle: settings.siteTitle,
				footerCopyright: settings.footerCopyright,
			})
			res.writeHead(200, { "Content-Type": "text/html" })
			res.end(response)
		})

		.post("/admin-config-site", async (req, res) => {
			const settings = await getSettings()

			const form = formidable() // Formidable instance must be called inside the route!
			try {
				form.parse(req, async (err, fields, files) => {
					if (err) {
						console.error("Error while parsing `/admin-config-site` request:", err.message)

						res.writeHead(302, { Location: "/500" })
						res.end()
						return // Prevent rest of code execution in case of error
					}

					// Convert arrays of fields to strings
					fields = Object.fromEntries(
						Object.entries(fields).map(([key, value]) => [
							key,
							Array.isArray(value) ? value.join(", ") : value,
						])
					)

					fields.postsPerPage = JSON.parse(fields.postsPerPage) // Get the value of postsPerPage as a number
					fields.searchFeature = JSON.parse(fields.searchFeature) // Get the value of searchFeature as a boolean
					fields.addIdsToHeadings = JSON.parse(fields.addIdsToHeadings) // Get the value of addIdsToHeadings as a boolean

					fields.menuLinks = settings.menuLinks

					// Convert the JavaScript object to a JSON string
					const jsonString = JSON.stringify(fields)

					// Convert the JSON string to a Buffer
					const binaryData = Buffer.from(jsonString, "utf-8")

					// Update `settings.json` under `config` folder in drive
					await drive.put("config/settings.json", { data: binaryData })

					// Redirect to a specific path on success within the application (relative path)
					res.writeHead(302, { Location: "/admin" })
					res.end()
				})
			} catch (error) {
				console.error("Error while posting site config:", error.message)

				res.writeHead(302, { Location: "/500" })
				res.end()
				return
			}
		})

		.post("/admin-config-menu", async (req, res) => {
			const settings = await getSettings()

			const form = formidable() // Formidable instance must be called inside the route!

			try {
				form.parse(req, async (err, fields, files) => {
					if (err) {
						console.error("Error while parsing `/admin-config-menu` request:", err.message)

						res.writeHead(302, { Location: "/500" })
						res.end()
						return // Prevent rest of code execution in case of error
					}

					// Convert arrays of fields to strings
					fields = Object.fromEntries(
						Object.entries(fields).map(([key, value]) => [
							key,
							Array.isArray(value) ? value.join(", ") : value,
						])
					)

					let menuSettings = fields

					menuSettings = transformParsedBody(menuSettings, "menuLinks")

					delete settings.menuLinks

					let object = {}
					menuSettings.menuLinks.forEach((obj) => {
						object[obj.linkTarget] = obj.linkTitle
					})
					object.admin = "Admin ⚡" // Added here, because it's removed `from menu configuration`
					settings.menuLinks = object

					// Convert the JavaScript object to a JSON string
					const jsonString = JSON.stringify(settings)

					// Convert the JSON string to a Buffer
					const binaryData = Buffer.from(jsonString, "utf-8")

					// Update `settings.json` under `config` folder in drive
					await drive.put("config/settings.json", { data: binaryData })

					// Redirect to a specific path on success within the application (relative path)
					res.writeHead(302, { Location: "/admin" })
					res.end()
				})
			} catch (error) {
				console.error("Error while posting menu config:", error.message)

				res.writeHead(302, { Location: "/500" })
				res.end()
				return
			}
		})
}
