import { Router } from "express"
const router = Router()

import { getPosts } from "../functions/getPosts.js"
const posts = await getPosts()

// Settings
import { settings } from "../config/settings.js"
const { siteTitle, menuLinks, searchImage, postPreviewFallbackImage, footerCopyright } = settings

const titles = {
	siteTitle: siteTitle,
	docTitle: "Search",
	docDescription: "Make a research in the site's posts",
}

// Render the search form on the search route.
export const searchRoute = router
	.get("/search", (req, res) => {
		res.render("layouts/base", {
			searchRoute: true,
			links: menuLinks,
			titles: titles,
			featuredImage: searchImage,
			footerCopyright: footerCopyright,
		})
	})

	// Render the search result(s) of a query
	.get("/search/:query", (req, res) => {
		const query = req.params.query
		const reg = new RegExp(query, "gi")

		const titleSearch = posts.filter((post) => post[1].data.title.match(reg))
		const contentSearch = posts.filter((post) => post[1].content.match(reg))

		// Concatenate the results of titleSearch and contentSearch
		const concat = titleSearch.concat(contentSearch)

		// Get the unique result(s) by removing duplicates from concat array
		const uniqueProps = []
		const result = concat.filter((post) => {
			const isDuplicate = uniqueProps.includes(post[1].data.title)

			if (!isDuplicate) {
				uniqueProps.push(post[1].data.title)

				return true
			}

			return false
		})

		// If the result array is not empty
		if (result.length > 0) {
			const resultLength = result.length
			// Render the search page with the resultant post(s)
			res.render("layouts/base", {
				searchRoute: true,
				links: menuLinks,
				titles: titles,
				posts: result,
				resultLength: resultLength,
				results: true,
				featuredImage: searchImage,
				paginated: false,
				footerCopyright: footerCopyright,
			})
		} else {
			/**
			 * If the result array is empty,
			 * render the search page,
			 * with a message.
			 */
			res.render("layouts/base", {
				searchRoute: true,
				links: menuLinks,
				titles: titles,
				noResults: true,
				featuredImage: searchImage,
				footerCopyright: footerCopyright,
			})
		}
	})

	// Redirect a search to the result(s) of a query
	.post("/search", (req, res) => {
		const { searchString } = req.body
		res.redirect(`/search/${searchString}`)
	})
