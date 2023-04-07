import express from "express"
const app = express()

const port = process.env.PORT || 3000

app.use(express.static("public"))
app.set("view engine", "ejs")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

import { settings } from "./config/settings.js"
const { siteTitle, searchFeature, menuLinks, footerCopyright } = settings

// Admin routes
import { adminRoutes, adminUpdateDelete } from "./routes/admin/adminRoute.js"
import { adminConfigRoute } from "./routes/admin/adminConfigRoute.js"
import { adminCreateRoute } from "./routes/admin/adminCreateRoute.js"
import { adminGalleryRoute } from "./routes/admin/adminGalleryRoute.js"
import { adminBuildAndDownloadRoute } from "./routes/admin/adminBuildAndDownloadRoute.js"
app.use(
	[adminRoutes, adminUpdateDelete, adminConfigRoute, adminCreateRoute, adminGalleryRoute, adminBuildAndDownloadRoute],
	(req, res, next) => {
		next()
	}
)

// Search route
import { searchRoute } from "./routes/searchRoute.js"
if (searchFeature) app.use("/", searchRoute)

// Routes
import { mainRoute } from "./routes/mainRoute.js"
import { filesRoute } from "./routes/filesRoute.js"
import { tagsRoute } from "./routes/tagsRoute.js"
import { archiveRoute } from "./routes/archiveRoute.js"
import { rssRoute } from "./routes/rssRoute.js"
import { sitemapRoute } from "./routes/sitemapRoute.js"

app.use([mainRoute, archiveRoute, rssRoute, sitemapRoute, tagsRoute, filesRoute], (req, res, next) => {
	next()
})

// 404 route
app.use((req, res, next) => {
	const titles = {
		siteTitle: siteTitle,
		docTitle: "Page Not Found",
		docDescription: "The server cannot find the requested resource",
		subTitle: "Nothing to land on here !",
	}
	res.status(404).render("layouts/base", {
		errorRoute: true,
		links: menuLinks,
		titles: titles,
		imageSrc: "/images/404-not-found-error.png",
		imageAlt: "Sailor on a 404 mast looking out to sea",
		footerCopyright: footerCopyright,
	})
})

// 500 route
app.use((err, req, res, next) => {
	console.error(err.stack)
	const titles = {
		siteTitle: siteTitle,
		docTitle: "Internal Server Error",
		docDescription: "The server encountered an unexpected condition that prevented it from fulfilling the request",
		subTitle: "Server is on a break here !",
	}
	res.status(500).render("layouts/base", {
		errorRoute: true,
		links: menuLinks,
		titles: titles,
		imageSrc: "/images/500-internal-server-error.png",
		imageAlt: "Sad robot in front of empty box",
		footerCopyright: footerCopyright,
	})
})

app.listen(port, () => {
	console.log(`App 🚀 @ http://localhost:${port}`)
})
