const router = global.router

const postsByTagCount = require("../functions/postsByTagCount")
const postsByTagList = require("../functions/postsByTagList")

// Settings
const { siteTitle, menuLinks, footerCopyright } = require("../config/settings.json")

// Render all the tags from the list of posts on the postsByTagCount route
router.get("/tags", (req, res) => {
	// Define the titles for the tags route
	const titles = {
		siteTitle: siteTitle,
		docTitle: "Tags",
		docDescription: "A list of all the tags",
		title: "Tags",
		subTitle: "A list of all the tags",
	}
	res.render("layouts/postsByTagCount", {
		links: menuLinks,
		titles: titles,
		postsByTagCount: postsByTagCount(),
		footerCopyright: footerCopyright,
	})
})

// Dynamic route to render the list of posts matching the `:tag` request parameter
router.get("/tags/:tag", (req, res) => {
	const tag = req.params.tag
	const postsByTag = postsByTagList(tag)
	// Define the titles for any requested tag route
	const titles = {
		siteTitle: siteTitle,
		docTitle: `Posts Tagged "${tag}"`,
		docDescription: `List of posts tagged ${tag}`,
		title: postsByTag.length > 1 ? `Posts Tagged "${tag}"` : `Post Tagged "${tag}"`,
		subTitle: postsByTag.length > 1 ? `${postsByTag.length} posts with this tag` : "1 post with this tag",
	}
	if (postsByTag != 0) {
		// If the postsByTagArray is not empty, render the list of post(s) for the requested tag
		res.render("layouts/postsList", {
			links: menuLinks,
			titles: titles,
			posts: postsByTag,
			paginated: false, // To hide the pagination component on any requested tag route
			footerCopyright: footerCopyright,
		})
	} else {
		// If no tag matches the requested tag, render the 404 page
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
	}
})

module.exports = router
