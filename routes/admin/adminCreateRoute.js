import { Router } from "express"
const router = Router()

import { writeFile } from "node:fs/promises"
import { dirname } from "path"
import { fileURLToPath } from "url"
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Functions
import { getImages } from "../../functions/getImages.js"

// Settings
import { settings } from "../../config/settings.js"
const { siteTitle, footerCopyright } = settings

// Route to create a page or a post.
const titles = {
	siteTitle: siteTitle,
	docTitle: "Admin Create",
	docDescription: `${siteTitle} Creation Page`,
}

export const adminCreateRoute = router
	.get("/admin-create", async (req, res) => {
		res.render("layouts/admin/adminCreate", {
			adminCreate: true,
			titles: titles,
			images: await getImages(),
			footerCopyright: footerCopyright,
		})
	})

	.post("/admin-create", (req, res) => {
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
		} = req.body

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

		const createdFilePath = `${__dirname}/../../views/${fileType}s`

		if (fileType === "page") {
			const createdPageName = pageTitle
				.toLowerCase()
				.replace(/[^a-zA-Z0-9-_ ]/g, "") // Remove special characters except hyphen and underscore
				.replace(/_+/g, "-") // Replace any number of underscore by one hyphen
				.replace(/\s+/g, "-") // Replace any number of space by one hyphen
				.replace(/^-+/, "") // Remove any number of hyphen at the beginning
				.replace(/-+/g, "-") // Replace any number of hyphen by one hyphen only
				.replace(/-+$/, "") // Remove any number of hyphen at the end

			writeFile(`${createdFilePath}/${createdPageName}.md`, pageContents, "utf8").then(() => {
				res.redirect(`/admin-create?created=/pages/${createdPageName}`)
			})
		} else {
			const createdPostName = postTitle
				.toLowerCase()
				.replace(/[^a-zA-Z0-9-_ ]/g, "") // Remove special characters except hyphen and underscore
				.replace(/_+/g, "-") // Replace any number of underscore by one hyphen
				.replace(/\s+/g, "-") // Replace any number of space by one hyphen
				.replace(/^-+/, "") // Remove any number of hyphen at the beginning
				.replace(/-+/g, "-") // Replace any number of hyphen by one hyphen only
				.replace(/-+$/, "") // Remove any number of hyphen at the end

			writeFile(`${createdFilePath}/${createdPostName}.md`, postContents, "utf8").then(() => {
				res.redirect(`/admin-create?created=/posts/${createdPostName}`)
			})
		}
	})
