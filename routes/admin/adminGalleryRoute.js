// Internal Modules
import { readFileSync } from "fs"

// Internal Functions
import { getIcons, getImages } from "../../functions/blog-doc.js"
import { initializeApp } from "../../functions/initialize.js"
import { drive } from "../../functions/deta-drive.js"

const { eta } = initializeApp()

// Settings
import { getSettings } from "../../functions/settings.js"

import { formidable } from "formidable"

// GALLERIES ROUTE - Since v5.1.0
export const adminGalleryRoute = (app) => {
	app.get("/admin/gallery/:files", async (req, res) => {
		const settings = await getSettings()

		const { files } = req.params
		const firstLetter = files.charAt(0)
		const firstLetterCap = firstLetter.toUpperCase()
		const remainingLetters = files.slice(1)
		const capitalizedFiles = firstLetterCap + remainingLetters

		const data = {
			title: `${capitalizedFiles} gallery`,
			description: `${settings.siteTitle} ${files} gallery page`,
		}
		const response = eta.render("admin/layouts/adminGallery.html", {
			adminGallery: true,
			adminIcons: files == "icons" ? true : false,
			data: data,
			images: files == "icons" ? await getIcons() : await getImages(),
			siteTitle: settings.siteTitle,
			footerCopyright: settings.footerCopyright,
		})
		res.writeHead(200, { "Content-Type": "text/html" })
		res.end(response)
	})
		.post("/add/:image", async (req, res) => {
			const { image } = req.params

			const form = formidable({ keepExtensions: true }) // Formidable instance must be called inside the route!
			try {
				form.parse(req, async (err, fields, files) => {
					if (err) {
						console.error(`Error while parsing "/add/${image}" request:`, err.message)

						res.writeHead(302, { Location: "/500" })
						res.end()
						return // Prevent rest of code execution in case of error
					}

					// Iterate over each property in the 'files' object
					for (const property of Object.keys(files)) {
						//const directory = property

						// Iterate over each object in the property array
						for (const file of files[property]) {
							const fileName = file.originalFilename
							const filePath = file.filepath

							// Read each file content
							const fileContent = readFileSync(filePath)

							// Upload each file under the respective directory in drive
							image == "icon"
								? await drive.put(`icons/${fileName}`, { data: fileContent })
								: await drive.put(`images/${fileName}`, { data: fileContent })

							console.log(`Successfully added ${fileName} to ${image}s folder`)
						}
					}

					res.writeHead(200, { "Content-Type": "text/plain" })
					res.end("uploaded!")
					return
				})
			} catch (error) {
				console.error(`Error while adding ${image}:`, error.message)

				res.writeHead(302, { Location: "/500" })
				res.end()
				return
			}
		})

		.post("/save/:image", (req, res) => {
			// Get the request parameter from FilePond server
			const { image } = req.params

			res.writeHead(302, { Location: `/admin/gallery/${image}s` })
			res.end()
			return
		})

		/**
		 * Used erase instead of delete because adminRoute() precedes adminGalleryRoute()
		 * The request parameter property will be `filename` and not `image`
		 */
		.post("/erase/:image", async (req, res) => {
			// Get the request parameter from `delete-image` form
			const { image } = req.params

			const form = formidable({ keepExtensions: true }) // Formidable instance must be called inside the route!
			try {
				form.parse(req, async (err, fields, files) => {
					if (err) {
						console.error(`Error while parsing "/erase/${image}" request:`, err.message)

						res.writeHead(302, { Location: "/500" })
						res.end()
						return // Prevent rest of code execution in case of error
					}

					// Convert arrays of fields to strings
					fields = Object.fromEntries(
						Object.entries(fields).map(([key, value]) => [
							key,
							Array.isArray(value) ? value.join(", ") : value,
						])
					)

					const { imageName } = fields
					await drive.delete(`${image}s/${imageName}`)
					console.log(`Successfully erased ${imageName} from ${image}s folder`)

					// Redirect to a specific path on success within the application (relative path)
					res.writeHead(302, { Location: `/admin/gallery/${image}s` })
					res.end()
					return
				})
			} catch (error) {
				console.error(`Error while erasing ${image}:`, error.message)

				res.writeHead(302, { Location: "/500" })
				res.end()
				return
			}
		})
}
