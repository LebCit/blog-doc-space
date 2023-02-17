const router = global.router

// Settings
const { siteTitle, menuLinks, footerCopyright } = require("../../config/settings.json")

// Admin routes to create, update, delete.
const titles = {
	siteTitle: siteTitle,
	docTitle: "Administration",
	docDescription: `${siteTitle} administration page`,
	title: "Administration",
	subTitle: `${siteTitle} administration page`,
}

// RENDER THE AVAILABLE ACTIONS ON THE ADMIN ROUTE.
router.get("/admin", (req, res) => {
	res.render("layouts/admin/admin", {
		links: menuLinks,
		titles: titles,
		footerCopyright: footerCopyright,
	})
})

module.exports = router
