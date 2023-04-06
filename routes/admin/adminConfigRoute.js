import { Router } from "express"
const router = Router()

import { writeFile } from "node:fs/promises"

// Functions
import { getImages } from "../../functions/getImages.js"

// Settings
import { settings } from "../../config/settings.js"

// ROUTE TO MODIFY THE APP SETTINGS.
const titles = {
	siteTitle: settings.siteTitle,
	docTitle: "Config Settings",
	docDescription: `${settings.siteTitle} settings configuration page`,
}

export const adminConfigRoute = router
	.get("/admin-config", async (req, res) => {
		res.render("layouts/admin/adminConfig", {
			adminConfig: true,
			links: settings.adminLinks,
			titles: titles,
			settings: settings,
			images: await getImages(),
			footerCopyright: settings.footerCopyright,
		})
	})

	.post("/admin-config", async (req, res) => {
		let settings = req.body

		//console.log(settings)

		let menuLinks = settings.menuLinks
		let object = {}
		menuLinks.forEach((obj) => {
			object[obj.linkTarget] = obj.linkTitle
		})
		object.admin = "Admin ⚡" // Added here, because it's removed from the `settings configuration page`.
		settings.menuLinks = object
		settings.searchFeature = JSON.parse(settings.searchFeature)
		settings.addIdsToHeadings = JSON.parse(settings.addIdsToHeadings)

		let adminLinks = {
			admin: "Admin ⚡",
			"admin-pages": "📃 Pages",
			"admin-posts": "📝 Posts",
			"admin-create": "➕ New",
			"admin-gallery": "🖼️ Gallery",
			"admin-config": "⚙️ Settings",
		}
		settings.adminLinks = adminLinks

		await writeFile("config/settings.json", JSON.stringify(settings), "utf8")
		res.redirect("/admin")
	})
