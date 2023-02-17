const router = global.router

const fs = require("fs")

// Settings
const { siteTitle, menuLinks, footerCopyright } = require("../../config/settings.json")

// Route to create a page or a post.
const titles = {
	siteTitle: siteTitle,
	docTitle: "Admin Create",
	docDescription: `${siteTitle} administration page to create`,
	title: "Admin Create",
	subTitle: `${siteTitle} administration page to create`,
}

router.get("/admin-create", (req, res) => {
	res.render("layouts/admin/adminCRUD", {
		links: menuLinks,
		titles: titles,
		footerCopyright: footerCopyright,
		adminCreate: true,
		adminCrud: true,
	})
})

router.post("/admin-create", (req, res) => {
	const {
		fileType,
		fileContents,
		pageTitle,
		pageSubTitle,
		postTitle,
		postDate,
		postDescription,
		postImage,
		postTags,
	} = req.body

	const pageContents = `---
title : ${pageTitle}
subTitle: ${pageSubTitle}
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
			.replace(/[^a-zA-Z0-9-_ ]/g, "")
			.replace(/\s+/g, "-")

		fs.promises.writeFile(`${createdFilePath}/${createdPageName}.md`, pageContents, "utf8").then(() => {
			res.redirect(`/${createdPageName}`)
		})
	} else {
		const createdPostName = postTitle
			.toLowerCase()
			.replace(/[^a-zA-Z0-9-_ ]/g, "")
			.replace(/\s+/g, "-")

		fs.promises.writeFile(`${createdFilePath}/${createdPostName}.md`, postContents, "utf8").then(() => {
			res.redirect(`/${createdPostName}`)
		})
	}
})

module.exports = router
