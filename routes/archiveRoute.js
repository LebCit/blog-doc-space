import { Router } from "express"
const router = Router()

import { getPosts } from "../functions/getPosts.js"
const posts = await getPosts()

// Settings
import { settings } from "../config/settings.js"
const { siteTitle, menuLinks, footerCopyright } = settings

const titles = {
	siteTitle: siteTitle,
	docTitle: "Archive",
	docDescription: "A list of all the posts",
}

// Render all the posts from the list of posts on the archive route.
export const archiveRoute = router.get("/posts", (req, res) => {
	res.render("layouts/base", {
		archiveRoute: true,
		links: menuLinks,
		titles: titles,
		posts: posts,
		paginated: false, // To hide the pagination component on the archive route.
		featuredImage: "/images/assorted-folders-photo.avif",
		footerCopyright: footerCopyright,
	})
})
