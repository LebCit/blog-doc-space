const express = require("express")
const app = express()
exports.app = app
const { siteTitle ,searchFeature, menuLinks, footerCopyright } = require("./config/settings.json")

const port = process.env.PORT || 3000

app.use(express.static("public"))
app.set("view engine", "ejs")

if (!process.env.DETA_SPACE_APP) {
	const liveReload = require("./functions/liveReload")
	liveReload()
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const router = (global.router = express.Router())
app.use(router)

app.use("/", require("./routes/mainRoute"))
app.use("/", require("./routes/filesRoute"))
app.use("/", require("./routes/archiveRoute"))
app.use("/", require("./routes/tagsRoute"))
app.use("/", require("./routes/rssRoute"))
app.use("/", require("./routes/sitemapRoute"))
if (searchFeature) app.use("/", require("./routes/searchRoute"))
app.use("/", require("./routes/admin/adminRoute"))
app.use("/", require("./routes/admin/adminCreateRoute"))
app.use("/", require("./routes/admin/adminUpdateRoute"))
app.use("/", require("./routes/admin/adminDeleteRoute"))
app.use("/", require("./routes/admin/adminConfigRoute"))

// 404 route
app.use((req, res, next) => {
	const titles = {
		siteTitle: siteTitle,
		docTitle: "Page Not Found",
		docDescription: "The server cannot find the requested resource",
	}
	res.status(404).render("layouts/error", {
		links: menuLinks,
		titles: titles,
		headerTitle: "Page Not Found",
		headerSubtitle: "Nothing to land on here !",
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
	}
	res.status(500).render("layouts/error", {
		links: menuLinks,
		titles: titles,
		headerTitle: "Internal Server Error",
		headerSubtitle: "Server is on a break here !",
		imageSrc: "/images/500-internal-server-error.png",
		imageAlt: "Sad robot in front of empty box",
		footerCopyright: footerCopyright,
	})
})

app.listen(port, () => {
	console.log(`App 🚀 @ http://localhost:${port}`)
})
