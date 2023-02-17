const router = global.router

const fs = require("fs")

// Settings
const settings = require("../../config/settings.json")

// ROUTE TO MODIFY THE APP SETTINGS.
const titles = {
	siteTitle: settings.siteTitle,
	docTitle: "Config Settings",
	docDescription: `${settings.siteTitle} settings configuration page`,
	title: "Config Settings",
	subTitle: `${settings.siteTitle} settings configuration page`,
}

const config = fs.readFileSync("config/settings.json", "utf8", (err, data) => {
	if (err) throw err

	return data
})

router.get("/admin-config", (req, res) => {
	res.render("layouts/admin/adminConfig", {
		links: settings.menuLinks,
		titles: titles,
		settings: settings,
		footerCopyright: settings.footerCopyright,
		adminConfig: true,
	})
})

router.post("/admin-config", (req, res) => {
	let settings = req.body

	let menuLinks = settings.menuLinks
	let object = {}
	menuLinks.forEach((obj) => {
		object[obj.linkTarget] = obj.linkTitle
	})
	settings.menuLinks = object
	settings.searchFeature = JSON.parse(settings.searchFeature)
	settings.addIdsToHeadings = JSON.parse(settings.addIdsToHeadings)

	fs.writeFileSync("config/settings.json", JSON.stringify(settings), "utf8")
	res.redirect("/admin")
})

module.exports = router
