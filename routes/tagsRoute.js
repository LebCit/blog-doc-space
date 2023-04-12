import { Router } from "express"
const router = Router()

import { postsByTagCount } from "../functions/postsByTagCount.js"
import { postsByTagList } from "../functions/postsByTagList.js"

// Settings
import { settings } from "../config/settings.js"
const { siteTitle, menuLinks, tagsImage, tagImage, postPreviewFallbackImage, footerCopyright } = settings

// Render all the tags from the list of posts on the postsByTagCount route
export const tagsRoute = router
	.get("/tags", (req, res) => {
		// Define the titles for the tags route
		const titles = {
			siteTitle: siteTitle,
			docTitle: "Tags",
			docDescription: "A list of all the tags",
		}
		res.render("layouts/base", {
			tagsRoute: true,
			links: menuLinks,
			titles: titles,
			postsByTagCount: postsByTagCount(),
			featuredImage: tagsImage,
			footerCopyright: footerCopyright,
		})
	})

	// Dynamic route to render the list of posts matching the `:tag` request parameter
	.get("/tags/:tag", (req, res) => {
		const tag = req.params.tag
		const postsByTag = postsByTagList(tag)
		// Define the titles for any requested tag route
		const titles = {
			siteTitle: siteTitle,
			docTitle: postsByTag.length > 1 ? `Posts Tagged "${tag}"` : `Post Tagged "${tag}"`,
			docDescription: `List of posts tagged ${tag}`,
			subTitle: postsByTag.length > 1 ? `${postsByTag.length} posts with this tag` : "1 post with this tag",
		}
		if (postsByTag != 0) {
			// If the postsByTagArray is not empty, render the list of post(s) for the requested tag
			res.render("layouts/base", {
				tagRoute: true,
				links: menuLinks,
				titles: titles,
				posts: postsByTag,
				paginated: false, // To hide the pagination component on any requested tag route
				featuredImage: tagImage,
				footerCopyright: footerCopyright,
			})
		} else {
			// If no tag matches the requested tag, render the 404 page
			const titles = {
				siteTitle: siteTitle,
				docTitle: "Error 404",
				docDescription: "The server cannot find the requested resource",
				subTitle: "Nothing to land on here !",
			}
			// Render the 404 error page if no file in the pages, posts and templates sub-directories matches the filename request parameter
			res.status(404).render("layouts/base", {
				errorRoute: true,
				links: menuLinks,
				titles: titles,
				featuredImage: "/img/404-graphic-illustration.webp",
				footerCopyright: footerCopyright,
			})
		}
	})
