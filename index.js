import { initializeApp } from "./functions/initialize.js"
import { staticAssetLoader } from "./functions/static-asset-loader.js"
import { createServer } from "velocy"
import { drive } from "./functions/deta-drive.js"

// Initialize application
const { app } = initializeApp()
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
adminRoutes(app)
adminCreateRoute(app)
adminUpdateDelete(app)
adminGalleryRoute(app)
adminConfigRoute(app)

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

import { errorRoute } from "./routes/errorRoute.js"
errorRoute(app)

createServer(app).listen(port, () => {
	console.log(`App @ http://localhost:${port}`)
})
