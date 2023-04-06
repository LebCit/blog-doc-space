import { Router } from "express"
const router = Router()

import { sitemap } from "../functions/sitemap.js"

// Render the sitemap on the sitemap route
export const sitemapRoute = router.get("/sitemap", (req, res) => {
	res.set("Content-Type", "text/xml").render("layouts/sitemap", {
		urls: sitemap(),
	})
})
