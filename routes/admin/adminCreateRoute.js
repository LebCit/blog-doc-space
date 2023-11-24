// Internal Functions
import { getImages, getPages, getPosts } from "../../functions/blog-doc.js"
import { initializeApp } from "../../functions/initialize.js"
const { eta } = initializeApp()

// Settings
import { getSettings } from "../../functions/settings.js"

import { formidable } from "formidable"

import { drive } from "../../functions/deta-drive.js"

/* let test = await getPages() */

// Route to create a page or a post.
export const adminCreateRoute = (app) => {
	app.get("/admin-create", async (req, res) => {
		const settings = await getSettings()

		const data = {
			title: "Admin Create",
			description: `${settings.siteTitle} Creation Page`,
		}
		const response = eta.render("admin/layouts/adminCreate.html", {
			adminCreate: true,
			data: data,
			images: await getImages(),
			siteTitle: settings.siteTitle,
			footerCopyright: settings.footerCopyright,
		})
		res.writeHead(200, { "Content-Type": "text/html" })
		res.end(response)
	})

		.get("/check-admin-create", async (req, res) => {
			// Merge the pages and the posts arrays into a single array named mdFiles
			const pages = await getPages()
			const posts = await getPosts()
			const mdFiles = pages.concat(posts)
			// Create a new array called mdTitles populated by Markdown files titles
			const mdTitles = mdFiles.map((x) => x[0])
			// Send mdTitles array to the client
			res.end(JSON.stringify(mdTitles))
		})

		.post("/admin-create", (req, res) => {
			const form = formidable() // Formidable instance must be called inside the route!

			form.parse(req, async (err, fields, files) => {
				if (err) {
					console.error("Error while parsing `/admin-create` request:", err.message)

					res.writeHead(302, { Location: "/500" })
					res.end()
					return // Prevent rest of code execution in case of error
				}

				// Convert arrays of fields to strings
				fields = Object.fromEntries(
					Object.entries(fields).map(([key, value]) => [key, Array.isArray(value) ? value.join(", ") : value])
				)

				const {
					fileType,
					fileContents,
					pageTitle,
					pageDescription,
					pageImage,
					postTitle,
					postDate,
					postDescription,
					postImage,
					postTags,
				} = fields

				const pageContents = `---
title : ${pageTitle}
description: ${pageDescription}
featuredImage: ${pageImage}
---
${fileContents}`

				const postContents = `---
title : ${postTitle}
date: ${postDate.split("-").join("/")}
description: ${postDescription}
featuredImage: ${postImage}
tags: [${postTags}]
---
${fileContents}`

				const utf8Encoder = new TextEncoder()

				if (fileType === "page") {
					const createdPageName = pageTitle
						.toLowerCase()
						.replace(/[^a-zA-Z0-9-_ ]/g, "") // Remove special characters except hyphen and underscore
						.replace(/_+/g, "-") // Replace any number of underscore by one hyphen
						.replace(/\s+/g, "-") // Replace any number of space by one hyphen
						.replace(/^-+/, "") // Remove any number of hyphen at the beginning
						.replace(/-+/g, "-") // Replace any number of hyphen by one hyphen only
						.replace(/-+$/, "") // Remove any number of hyphen at the end

					const utf8Array = utf8Encoder.encode(pageContents)
					await drive.put(`pages/${createdPageName}.md`, { data: utf8Array })
					res.writeHead(302, { Location: `/pages/${createdPageName}` })
					res.end()
				} else {
					const createdPostName = postTitle
						.toLowerCase()
						.replace(/[^a-zA-Z0-9-_ ]/g, "") // Remove special characters except hyphen and underscore
						.replace(/_+/g, "-") // Replace any number of underscore by one hyphen
						.replace(/\s+/g, "-") // Replace any number of space by one hyphen
						.replace(/^-+/, "") // Remove any number of hyphen at the beginning
						.replace(/-+/g, "-") // Replace any number of hyphen by one hyphen only
						.replace(/-+$/, "") // Remove any number of hyphen at the end

					const utf8Array = utf8Encoder.encode(postContents)
					await drive.put(`posts/${createdPostName}.md`, { data: utf8Array })
					res.writeHead(302, { Location: `/posts/${createdPostName}` })
					res.end()
				}
			})
		})
}
