const router = global.router

const getPosts = require("../functions/getPosts")

// Settings
const { siteTitle, menuLinks, footerCopyright } = require("../config/settings.json")

const titles = {
	siteTitle: siteTitle,
	docTitle: "Archive",
	docDescription: "A list of all the posts",
	title: "Archive",
	subTitle: "A list of all the posts",
}

// Render all the posts from the list of posts on the archive route
router.get("/archive", (req, res) => {
	res.render("layouts/postsList", {
		links: menuLinks,
		titles: titles,
		posts: getPosts(),
		paginated: false, // To hide the pagination component on the archive route
		footerCopyright: footerCopyright,
	})
})

module.exports = router
