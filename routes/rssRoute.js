const router = global.router

const getPosts = require("../functions/getPosts")
const { siteTitle, siteDescription, siteURL, rssCopyright } = require("../config/settings.json")

// Render RSS feed on the rss route
router.get("/rss", (req, res) => {
	res.set("Content-Type", "text/xml").render("layouts/rss", {
		siteTitle: siteTitle,
		siteDescription: siteDescription,
		siteURL: siteURL,
		rssCopyright: rssCopyright,
		posts: getPosts(),
	})
})

module.exports = router
