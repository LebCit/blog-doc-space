// Internal Functions
import { getImages, getPages, getPosts } from "../../functions/blog-doc.js"
import { initializeApp } from "../../functions/initialize.js"
const { eta } = initializeApp()

// Settings
import { getSettings } from "../../functions/settings.js"

import { formidable } from "formidable"

import { drive } from "../../functions/deta-drive.js"

const adminRoutes = (app) => {
	app.get("/admin", async (req, res) => {
		const settings = await getSettings()

		const data = {
			title: "Administration",
			description: `${settings.siteTitle} Administration`,
		}

		const response = eta.render("admin/layouts/admin.html", {
			admin: true,
			data: data,
			siteTitle: settings.siteTitle,
			footerCopyright: settings.footerCopyright,
		})
		res.writeHead(200, { "Content-Type": "text/html" })
		res.end(response)
	})

		// RENDER THE POSTS IN A TABLE ON THE admin-posts ROUTE.
		.get("/admin-posts", async (req, res) => {
			const settings = await getSettings()

			const data = {
				title: "Admin Posts",
				description: `${settings.siteTitle} Posts`,
			}

			const response = eta.render("admin/layouts/adminTable.html", {
				adminTable: true,
				postsTable: true,
				data: data,
				posts: await getPosts(),
				siteTitle: settings.siteTitle,
				footerCopyright: settings.footerCopyright,
			})
			res.writeHead(200, { "Content-Type": "text/html" })
			res.end(response)
		})

		// RENDER THE PAGES IN A TABLE ON THE admin-pages ROUTE.
		.get("/admin-pages", async (req, res) => {
			const settings = await getSettings()

			const data = {
				title: "Admin Pages",
				description: `${settings.siteTitle} Pages`,
			}

			const response = eta.render("admin/layouts/adminTable.html", {
				adminTable: true,
				pagesTable: true,
				data: data,
				pages: await getPages(),
				siteTitle: settings.siteTitle,
				footerCopyright: settings.footerCopyright,
				adminTable: true,
				pagesTable: true,
			})
			res.writeHead(200, { "Content-Type": "text/html" })
			res.end(response)
		})
}
const adminUpdateDelete = (app) => {
	// RENDER EACH FILE ON THE /admin-update/fileName ROUTE.
	app.get("/admin-update/:filename", async (req, res) => {
		const settings = await getSettings()

		// Dynamic filename
		const { filename } = req.params

		// Merge the pages and the posts arrays into a single array named files
		const pages = await getPages()
		const posts = await getPosts()
		const files = pages.concat(posts)
		// Find the file in the files array
		const file = files.find((file) => file[0] === `${filename}.md`)

		const data = {
			title: `Update ${file[1].frontmatter.title}`,
			description: `Admin page to update ${file[1].frontmatter.title}`,
		}

		const response = eta.render("admin/layouts/adminUpdate.html", {
			adminUpdate: true,
			data: data,
			file: file,
			images: await getImages(),
			siteTitle: settings.siteTitle,
			footerCopyright: settings.footerCopyright,
		})
		res.writeHead(200, { "Content-Type": "text/html" })
		res.end(response)
	})

		// POST ON THE /admin-update/fileName ROUTE TO UPDATE.
		.post("/admin-update/:filename", (req, res) => {
			const form = formidable() // Formidable instance must be called inside the route!
			form.parse(req, async (err, fields, files) => {
				if (err) {
					console.error("Error while parsing `/admin-update/:filename` request:", err.message)

					res.writeHead(302, { Location: "/500" })
					res.end()
					return // Prevent rest of code execution in case of error
				}

				// Convert arrays of fields to strings
				fields = Object.fromEntries(
					Object.entries(fields).map(([key, value]) => [key, Array.isArray(value) ? value.join(", ") : value])
				)

				const {
					filePath,
					pageTitle,
					pageDescription,
					pageImage,
					postTitle,
					postDate,
					postDescription,
					postImage,
					postTags,
					fileContents,
				} = fields

				const updatedFile = filePath.split("/").pop().replace(".md", "")

				if (filePath.startsWith("pages/")) {
					const pageContents = `---
title: ${pageTitle}
description: ${pageDescription}
featuredImage: ${pageImage}
---
${fileContents}`

					const utf8Encoder = new TextEncoder()
					const utf8Array = utf8Encoder.encode(pageContents)

					await drive.put(`${filePath}`, { data: utf8Array })
					res.writeHead(302, { Location: `/pages/${updatedFile}` })
					res.end()
					return
				} else {
					const postContents = `---
title: ${postTitle}
date: ${postDate.split("-").join("/")}
description: ${postDescription}
featuredImage: ${postImage}
tags: [${postTags}]
---
${fileContents}`

					const utf8Encoder = new TextEncoder()
					const utf8Array = utf8Encoder.encode(postContents)

					await drive.put(`${filePath}`, { data: utf8Array })
					res.writeHead(302, { Location: `/posts/${updatedFile}` })
					res.end()
					return
				}
			})
		})

		// POST ON THE /delete/fileName ROUTE TO DELETE A FILE.
		.post("/delete/:filename", async (req, res) => {
			const form = formidable() // Formidable instance must be called inside the route!
			form.parse(req, async (err, fields, files) => {
				if (err) {
					console.error("Error while parsing `/delete/:filename` request:", err.message)

					res.writeHead(302, { Location: "/500" })
					res.end()
					return // Prevent rest of code execution in case of error
				}

				// Convert arrays of fields to strings
				fields = Object.fromEntries(
					Object.entries(fields).map(([key, value]) => [key, Array.isArray(value) ? value.join(", ") : value])
				)

				const { filePath } = fields

				try {
					await drive.delete(`${filePath}`)
					console.log(`successfully deleted ${filePath}`)

					// Redirect to a specific path on success within the application (relative path)
					res.writeHead(302, { Location: "/admin" })
					res.end()
					return
				} catch (error) {
					console.error("Error while deleting file:", error.message)

					res.writeHead(302, { Location: "/500" })
					res.end()
					return
				}
			})
		})
}

export { adminRoutes, adminUpdateDelete }
