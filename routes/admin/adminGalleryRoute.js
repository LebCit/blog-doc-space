// Internal Modules
import { readFileSync } from "fs"

// Internal Functions
import { getImages } from "../../functions/blog-doc.js"
import { initializeApp } from "../../functions/initialize.js"
import { drive } from "../../functions/deta-drive.js"

const { eta } = initializeApp()

// Settings
import { getSettings } from "../../functions/settings.js"

import { formidable } from "formidable"

// GALLERY ROUTE.
export const adminGalleryRoute = (app) => {
	app.get("/admin-gallery", async (req, res) => {
		const settings = await getSettings()

		const data = {
			title: "Images gallery",
			description: `${settings.siteTitle} gallery page`,
		}
		const response = eta.render("admin/layouts/adminGallery.html", {
			adminGallery: true,
			data: data,
			images: await getImages(),
			siteTitle: settings.siteTitle,
			footerCopyright: settings.footerCopyright,
		})
		res.writeHead(200, { "Content-Type": "text/html" })
		res.end(response)
	})
		.post("/add-image", async (req, res) => {
			const form = formidable({ keepExtensions: true }) // Formidable instance must be called inside the route!
			try {
				form.parse(req, async (err, fields, files) => {
					if (err) {
						console.error("Error while parsing `/add-image` request:", err.message)

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

							// Upload each file under the images directory in drive
							await drive.put(`images/${fileName}`, { data: fileContent })
						}
					}

					res.writeHead(200, { "Content-Type": "text/plain" })
					res.end("uploaded!")
					return
				})
			} catch (error) {
				console.error("Error while posting config:", error.message)

				res.writeHead(302, { Location: "/500" })
				res.end()
				return
			}
		})

		.post("/save-image", (req, res) => {
			res.writeHead(302, { Location: "/admin-gallery" })
			res.end()
			return
		})

		.post("/delete-image", async (req, res) => {
			const form = formidable({ keepExtensions: true }) // Formidable instance must be called inside the route!
			try {
				form.parse(req, async (err, fields, files) => {
					if (err) {
						console.error("Error while parsing `/delete-image` request:", err.message)

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
					await drive.delete(`images/${imageName}`)
					console.log(`successfully deleted images/${imageName}`)

					// Redirect to a specific path on success within the application (relative path)
					res.writeHead(302, { Location: "/admin-gallery" })
					res.end()
					return
				})
			} catch (error) {
				console.error("Error while deleting image:", error.message)

				res.writeHead(302, { Location: "/500" })
				res.end()
				return
			}
		})
}
