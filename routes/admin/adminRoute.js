const router = global.router

const fs = require("fs")

const getPages = require("../../functions/getPages")
const getPosts = require("../../functions/getPosts")

// Settings
const { siteTitle, adminLinks, footerCopyright } = require("../../config/settings.json")

router
	.get("/admin", (req, res) => {
		const titles = {
			siteTitle: siteTitle,
			docTitle: "Administration",
			docDescription: `${siteTitle} administration page`,
			title: "Administration",
			subTitle: `${siteTitle} administration page`,
		}

		res.render("layouts/admin/admin", {
			links: adminLinks,
			titles: titles,
			footerCopyright: footerCopyright,
		})
	})

	// RENDER THE POSTS IN A TABLE ON THE admin-posts ROUTE.
	.get("/admin-posts", (req, res) => {
		const titles = {
			siteTitle: siteTitle,
			docTitle: "Admin Posts",
			docDescription: `${siteTitle} posts administration page`,
			title: "Admin Posts",
			subTitle: `${siteTitle} posts administration page`,
		}

		res.render("layouts/admin/adminTable", {
			links: adminLinks,
			titles: titles,
			posts: getPosts(),
			footerCopyright: footerCopyright,
			adminTable: true,
			postsTable: true,
		})
	})

	// RENDER THE PAGES IN A TABLE ON THE admin-pages ROUTE.
	.get("/admin-pages", (req, res) => {
		const titles = {
			siteTitle: siteTitle,
			docTitle: "Admin Pages",
			docDescription: `${siteTitle} pages administration page`,
			title: "Admin Pages",
			subTitle: `${siteTitle} pages administration page`,
		}

		res.render("layouts/admin/adminTable", {
			links: adminLinks,
			titles: titles,
			pages: getPages(),
			footerCopyright: footerCopyright,
			adminTable: true,
			pagesTable: true,
		})
	})

// CREATE AN ARRAY OF PAGES AND POSTS.
const files = getPages().concat(getPosts())

let fileName
files.forEach((file) => {
	fileName = file[0].replace(".md", "")
	router
		// RENDER EACH FILE ON THE /admin-update/fileName ROUTE.
		.get(`/admin-update/${fileName}`, (req, res) => {
			const titles = {
				siteTitle: siteTitle,
				docTitle: `Update ${file[1].data.title}`,
				docDescription: `Admin page to update ${file[1].data.title}`,
				title: `Update ${file[1].data.title}`,
				subTitle: `Admin page to update ${file[1].data.title}`,
			}

			res.render("layouts/admin/adminUpdate", {
				links: adminLinks,
				titles: titles,
				file: file,
				footerCopyright: footerCopyright,
				adminUpdate: true,
			})
		})

		// POST ON THE /admin-update/fileName ROUTE TO UPDATE.
		.post(`/admin-update/${fileName}`, (req, res) => {
			const {
				filePath,
				pageTitle,
				pageSubTitle,
				postTitle,
				postDate,
				postDescription,
				postImage,
				postTags,
				fileContents,
			} = req.body

			const updatedFile = filePath.split("/").pop().replace(".md", "")

			if (filePath.startsWith("views/page")) {
				const pageContents = `---
title: ${pageTitle}
subTitle: ${pageSubTitle}
---
${fileContents}`

				fs.writeFileSync(`${filePath}`, pageContents, "utf8")
				res.redirect(`/${updatedFile}`)
			} else {
				const postContents = `---
title: ${postTitle}
date: ${postDate.split("-").join("/")}
description: ${postDescription}
featuredImage: ${postImage}
tags: [${postTags}]
---
${fileContents}`

				fs.writeFileSync(`${filePath}`, postContents, "utf8")
				res.redirect(`/${updatedFile}`)
			}
		})

		// POST ON THE /delete/fileName ROUTE TO DELETE A FILE.
		.post(`/delete/${fileName}`, (req, res) => {
			const { filePath } = req.body
			fs.unlink(`${filePath}`, (err) => {
				if (err) {
					throw err
				}
				console.log("File is deleted.")

				res.redirect(`/admin`)
			})
		})
})

module.exports = router
