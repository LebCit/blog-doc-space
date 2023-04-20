import { Router } from "express"
const router = Router()

import { writeFile, unlink } from "node:fs/promises"

// Functions
import { getImages } from "../../functions/getImages.js"
import { getPages } from "../../functions/getPages.js"
import { getPosts } from "../../functions/getPosts.js"

// Settings
import { settings } from "../../config/settings.js"
const { siteTitle, footerCopyright } = settings

const adminRoutes = router
	.get("/admin", (req, res) => {
		const titles = {
			siteTitle: siteTitle,
			docTitle: "Administration",
			docDescription: `${siteTitle} Administration`,
		}

		res.render("layouts/admin/admin", {
			admin: true,
			titles: titles,
			footerCopyright: footerCopyright,
		})
	})

	// RENDER THE POSTS IN A TABLE ON THE admin-posts ROUTE.
	.get("/admin-posts", async (req, res) => {
		const titles = {
			siteTitle: siteTitle,
			docTitle: "Admin Posts",
			docDescription: `${siteTitle} Posts`,
		}

		res.render("layouts/admin/adminTable", {
			adminTable: true,
			postsTable: true,
			titles: titles,
			posts: await getPosts(),
			footerCopyright: footerCopyright,
		})
	})

	// RENDER THE PAGES IN A TABLE ON THE admin-pages ROUTE.
	.get("/admin-pages", async (req, res) => {
		const titles = {
			siteTitle: siteTitle,
			docTitle: "Admin Pages",
			docDescription: `${siteTitle} Pages`,
		}

		res.render("layouts/admin/adminTable", {
			adminTable: true,
			pagesTable: true,
			titles: titles,
			pages: await getPages(),
			footerCopyright: footerCopyright,
			adminTable: true,
			pagesTable: true,
		})
	})

// CREATE AN ARRAY OF PAGES AND POSTS.
let pages = await getPages()
let posts = await getPosts()
let files = pages.concat(posts)

let fileName, adminUpdateDelete
files.forEach((file) => {
	fileName = file[0].replace(".md", "")
	adminUpdateDelete = router
		// RENDER EACH FILE ON THE /admin-update/fileName ROUTE.
		.get(`/admin-update/${fileName}`, async (req, res) => {
			const titles = {
				siteTitle: siteTitle,
				docTitle: `Update ${file[1].data.title}`,
				docDescription: `Admin page to update ${file[1].data.title}`,
			}

			res.render("layouts/admin/adminUpdate", {
				adminUpdate: true,
				titles: titles,
				file: file,
				images: await getImages(),
				footerCopyright: footerCopyright,
			})
		})

		// POST ON THE /admin-update/fileName ROUTE TO UPDATE.
		.post(`/admin-update/${fileName}`, async (req, res) => {
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
			} = req.body

			const updatedFile = filePath.split("/").pop().replace(".md", "")

			if (filePath.startsWith("views/pages")) {
				const pageContents = `---
title: ${pageTitle}
description: ${pageDescription}
featuredImage: ${pageImage}
---
${fileContents}`

				await writeFile(`${filePath}`, pageContents, "utf8")
				res.redirect(`/pages/${updatedFile}`)
			} else {
				const postContents = `---
title: ${postTitle}
date: ${postDate.split("-").join("/")}
description: ${postDescription}
featuredImage: ${postImage}
tags: [${postTags}]
---
${fileContents}`

				await writeFile(`${filePath}`, postContents, "utf8")
				res.redirect(`/posts/${updatedFile}`)
			}
		})

		// POST ON THE /delete/fileName ROUTE TO DELETE A FILE.
		.post(`/delete/${fileName}`, async (req, res) => {
			const { filePath } = req.body
			// Promise-based operations return a promise that is fulfilled when the asynchronous operation is complete.
			try {
				await unlink(`${filePath}`)
				// RESET THE PAGES AND POSTS ARRAYS BEFORE GOING BACK TO ADMIN.
				/* if (filePath.startsWith("views/pages")) {
					pages = pages.filter((page) => page[0] !== filePath.split("/").pop())
				} else {
					posts = posts.filter((post) => post[0] !== filePath.split("/").pop())
				} */
				console.log(`successfully deleted ${filePath}`)
				res.redirect(`/admin`)
			} catch (error) {
				console.error("there was an error:", error.message)
			}
		})
})

export { adminRoutes, adminUpdateDelete }
