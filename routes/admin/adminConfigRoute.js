import { Router } from "express"
const router = Router()

import { writeFile } from "node:fs/promises"

// Functions
import { getImages } from "../../functions/getImages.js"

// Settings
import { settings } from "../../config/settings.js"

// ROUTES TO MODIFY THE APP SETTINGS.
export const adminConfigRoute = router
	.get("/admin-config-site", async (req, res) => {
		const titles = {
			siteTitle: settings.siteTitle,
			docTitle: "Config Settings",
			docDescription: `${settings.siteTitle} Site Settings`,
		}

		res.render("layouts/admin/adminConfigSite", {
			adminConfig: true,
			titles: titles,
			settings: settings,
			images: await getImages(),
			footerCopyright: settings.footerCopyright,
		})
	})

	.get("/admin-config-menu", async (req, res) => {
		const titles = {
			siteTitle: settings.siteTitle,
			docTitle: "Menu Settings",
			docDescription: `${settings.siteTitle} Menu Settings`,
		}

		res.render("layouts/admin/adminConfigMenu", {
			adminConfig: true,
			titles: titles,
			settings: settings,
			images: await getImages(),
			footerCopyright: settings.footerCopyright,
		})
	})

	.post("/admin-config-site", async (req, res) => {
		let siteSettings = req.body

		siteSettings.postsPerPage = JSON.parse(siteSettings.postsPerPage) // Get the value of postsPerPage as a number
		siteSettings.searchFeature = JSON.parse(siteSettings.searchFeature) // Get the value of searchFeature as a boolean
		siteSettings.addIdsToHeadings = JSON.parse(siteSettings.addIdsToHeadings) // Get the value of addIdsToHeadings as a boolean
		siteSettings.menuLinks = settings.menuLinks // Assign the menuLinks to the siteSettings object

		await writeFile("config/settings.json", JSON.stringify(siteSettings), "utf8")
		res.redirect("/admin")
	})

	.post("/admin-config-menu", async (req, res) => {
		let menuSettings = req.body

		delete settings.menuLinks

		let object = {}
		menuSettings.menuLinks.forEach((obj) => {
			object[obj.linkTarget] = obj.linkTitle
		})
		object.admin = "Admin ⚡" // Added here, because it's removed `from menu configuration`
		settings.menuLinks = object

		await writeFile("config/settings.json", JSON.stringify(settings), "utf8")
		res.redirect("/admin")
	})
