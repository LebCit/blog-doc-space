import { formidable } from "formidable"
import { getPosts } from "../functions/blog-doc.js"
import { getSettings } from "../functions/settings.js"
import { initializeApp } from "../functions/initialize.js"

const { eta } = initializeApp()

export async function searchRoute(app) {
	const posts = await getPosts()

	// Render the search form on the search route
	app.get("/search", async (req, res) => {
		const settings = await getSettings()

		if (settings.searchFeature) {
			// Search Route data
			const data = {
				title: "Search",
				description: "Make a research in the site's posts",
				featuredImage: settings.searchImage,
			}

			const response = eta.render(`themes/${settings.currentTheme}/layouts/base.html`, {
				// Passing Route data
				searchRoute: true,
				// Passing document data
				data: data,
				// Passing needed settings for the template
				siteTitle: settings.siteTitle,
				menuLinks: settings.menuLinks,
				footerCopyright: settings.footerCopyright,
			})
			res.writeHead(200, { "Content-Type": "text/html" })
			res.end(response)
		} else {
			// Proceed to the 404 route if the search feature is not enabled
			res.writeHead(302, { Location: "/404" })
			res.end()
			return
		}
	})

		// Render the search result(s) of a query
		.get("/search/:query", async (req, res) => {
			const settings = await getSettings()

			if (settings.searchFeature) {
				// Search Route data
				const data = {
					title: "Search",
					description: "Make a research in the site's posts",
					featuredImage: settings.searchImage,
				}

				let { query } = req.params
				query = decodeURIComponent(query)
				const reg = new RegExp(query, "gi")

				const titleSearch = posts.filter((post) => post[1].frontmatter.title.match(reg))
				const contentSearch = posts.filter((post) => post[1].content.match(reg))

				// Concatenate the results of titleSearch and contentSearch
				const concat = titleSearch.concat(contentSearch)

				// Get the unique result(s) by removing duplicates from concat array
				const uniqueProps = []
				const result = concat.filter((post) => {
					const isDuplicate = uniqueProps.includes(post[1].frontmatter.title)

					if (!isDuplicate) {
						uniqueProps.push(post[1].frontmatter.title)

						return true
					}

					return false
				})

				// If the result array is not empty
				if (result.length > 0) {
					const resultLength = result.length
					// Render the search page with the resultant post(s)
					const response = eta.render(`themes/${settings.currentTheme}/layouts/base.html`, {
						// Passing Route data
						searchRoute: true,
						// Passing document data
						data: data,
						posts: result,
						resultLength: resultLength,
						results: true,
						paginated: false,
						// Passing document image data
						postPreviewFallbackImage: settings.postPreviewFallbackImage,
						// Passing needed settings for the template
						siteTitle: settings.siteTitle,
						menuLinks: settings.menuLinks,
						footerCopyright: settings.footerCopyright,
					})
					res.writeHead(200, { "Content-Type": "text/html" })
					res.end(response)
				} else {
					/**
					 * If the result array is empty,
					 * render the search page,
					 * with a message.
					 */
					const response = eta.render(`themes/${settings.currentTheme}/layouts/base.html`, {
						// Passing Route data
						searchRoute: true,
						// Passing document data
						data: data,
						noResults: true,
						// Passing needed settings for the template
						siteTitle: settings.siteTitle,
						menuLinks: settings.menuLinks,
						footerCopyright: settings.footerCopyright,
					})
					res.writeHead(200, { "Content-Type": "text/html" })
					res.end(response)
				}
			} else {
				// Proceed to the 404 route if the search feature is not enabled
				res.writeHead(302, { Location: "/404" })
				res.end()
				return
			}
		})

		// Redirect a search to the result(s) of a query
		.post("/search", (req, res) => {
			const form = formidable() // Formidable instance must be called inside the route!

			form.parse(req, async (err, fields, files) => {
				if (err) {
					console.error("Error while parsing `/search` request:", err.message)

					res.writeHead(302, { Location: "/500" })
					res.end()
					return // Prevent rest of code execution in case of error
				}

				// Convert arrays of fields to strings
				fields = Object.fromEntries(
					Object.entries(fields).map(([key, value]) => [key, Array.isArray(value) ? value.join(", ") : value])
				)
				const { searchString } = fields
				const redirectPath = `/search/${searchString}`
				res.writeHead(302, { Location: redirectPath })
				res.end()
			})
		})

		// Redirect an empty search to the search page
		.get("/search/", (req, res) => {
			const redirectPath = `/search`
			res.writeHead(302, { Location: redirectPath })
			res.end()
		})
}
