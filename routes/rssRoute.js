import { Router } from "express"
const router = Router()

import { getPosts } from "../functions/getPosts.js"
const posts = await getPosts()

// Settings
import { settings } from "../config/settings.js"
const { siteTitle, siteDescription, siteURL, rssSiteLanguage, rssCopyright } = settings

// Render RSS feed on the rss route
export const rssRoute = router.get("/rss", (req, res) => {
	res.set("Content-Type", "text/xml").render("layouts/rss", {
		siteTitle: siteTitle,
		siteDescription: siteDescription,
		siteURL: siteURL,
		rssSiteLanguage: rssSiteLanguage,
		rssCopyright: rssCopyright,
		posts: posts,
	})
})
