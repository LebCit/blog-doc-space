import { initializeApp } from "../../functions/initialize.js"
import { formidable } from "formidable"
import { readFileSync } from "fs"
import { drive } from "../../functions/deta-drive.js"

const { eta } = initializeApp()

export function adminBlogDocConfigRoute(app) {
	app.get("/admin-blog-doc-config", (req, res) => {
		res.writeHead(200, {
			"Content-Type": "text/html",
		})
		const settingsPage = eta.render("admin/config/adminBlogDocConfig.html")
		res.end(settingsPage)
	})
	app.post("/admin-blog-doc-config", (req, res) => {
		const form = formidable({
			keepExtensions: true,
		}) // Formidable instance must be called inside the route!

		try {
			form.parse(req, async (err, fields, files) => {
				if (err) {
					console.error("Error while parsing `/blog-doc-config` request:", err.message)

					res.writeHead(302, {
						Location: "/500",
					})
					res.end()
					return // Prevent rest of code execution in case of error
				}

				// Convert arrays of fields to strings
				fields = Object.fromEntries(
					Object.entries(fields).map(([key, value]) => [key, Array.isArray(value) ? value.join(", ") : value])
				)

				fields.postsPerPage = JSON.parse(fields.postsPerPage)
				fields.searchFeature = JSON.parse(fields.searchFeature)
				fields.addIdsToHeadings = JSON.parse(fields.addIdsToHeadings)
				fields.menuLinks = JSON.parse(fields.menuLinks)

				// Convert the JavaScript object to a JSON string
				const jsonString = JSON.stringify(fields)

				// Convert the JSON string to a Buffer
				const binaryData = Buffer.from(jsonString, "utf-8")

				// Create `settings.json` under `config` folder in drive
				await drive.put("config/settings.json", {
					data: binaryData,
				})

				// Iterate over each property in the 'files' object
				for (const property of Object.keys(files)) {
					const directory = property

					// Iterate over each object in the property array
					for (const file of files[property]) {
						const fileName = file.originalFilename
						const filePath = file.filepath
						const fileType = file.mimetype

						// Read each file content
						const fileContent = readFileSync(filePath)
						const utf8Encoder = new TextEncoder()
						const utf8Array = fileType.startsWith("image") ? fileContent : utf8Encoder.encode(fileContent) // If emojis are used!

						// Upload each file under its directory in drive
						await drive.put(`${directory}/${fileName}`, {
							data: utf8Array,
						})
					}
				}

				// Redirect to a specific path on success within the application (relative path)
				res.writeHead(302, {
					Location: "/",
				})
				res.end()
			})
		} catch (error) {
			console.error("Error while posting config:", error.message)

			res.writeHead(302, {
				Location: "/500",
			})
			res.end()
			return
		}
	})
}
