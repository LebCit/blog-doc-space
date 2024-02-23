import { initializeApp } from "./functions/initialize.js"
import { staticAssetLoader } from "./functions/static-asset-loader.js"
import { createServer } from "./functions/router.js"
import { drive } from "./functions/deta-drive.js"
import { getSettings } from "./functions/settings.js"

// Initialize application
const { app, eta } = initializeApp()
// Set the port value
const port = process.env.PORT || 8080
// Load static assets from `static` folder in Blog-Doc App
staticAssetLoader.serveStaticAssets(app)

// Load static assets from Blog-Doc Drive
import { staticAssetRoute } from "./routes/staticAssetRoute.js"
staticAssetRoute(app)

// Entry Route Depending On Drive's Content
import { mainRoute } from "./routes/mainRoute.js"
import { adminBlogDocConfigRoute } from "./routes/admin/adminBlogDocConfigRoute.js"
async function entryRoute() {
	let allFiles = (await drive.list()).names.length
	if (allFiles == 0) {
		adminBlogDocConfigRoute(app)
	} else {
		mainRoute(app)
	}
}
await entryRoute()

// Administration Routes
import { adminRoutes, adminUpdateDelete } from "./routes/admin/adminRoute.js"
import { adminCreateRoute } from "./routes/admin/adminCreateRoute.js"
import { adminGalleryRoute } from "./routes/admin/adminGalleryRoute.js"
import { adminConfigRoute } from "./routes/admin/adminConfigRoute.js"
import { adminPreviewRoute } from "./routes/admin/adminPreviewRoute.js"
adminRoutes(app)
adminCreateRoute(app)
adminUpdateDelete(app)
adminGalleryRoute(app)
adminConfigRoute(app)
adminPreviewRoute(app)

// Routes
import { markdownRoute } from "./routes/markdownRoute.js"
import { archiveRoute } from "./routes/archiveRoute.js"
import { searchRoute } from "./routes/searchRoute.js"
import { tagsRoute } from "./routes/tagsRoute.js"
import { rssRoute } from "./routes/rssRoute.js"
import { sitemapRoute } from "./routes/sitemapRoute.js"
markdownRoute(app)
archiveRoute(app)
searchRoute(app)
tagsRoute(app)
rssRoute(app)
sitemapRoute(app)

// 404 Route
app.notFound(async (req, res) => {
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
app.onError(async (error, req, res) => {
	console.error("Something went wrong:", error)
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

createServer(app).listen(port, () => {
	console.log(`App @ http://localhost:${port}`)
})
