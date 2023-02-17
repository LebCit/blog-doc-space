const router = global.router

const fs = require("fs")
const matter = require("gray-matter")
const glob = require("glob")

const files = glob.sync("views/**/*.md")
let filesArr = []
files.forEach((file) => {
	const fileData = matter.read(file)
	const fileContents = fs.readFileSync(file, "utf8", function (err, data) {
		return data
	})
	file = Object.assign(fileData, { fileContents })
	filesArr.push(file)
})

// Settings
const { siteTitle, menuLinks, footerCopyright } = require("../../config/settings.json")

// ROUTE TO UPDATE A PAGE OR A POST.
const titles = {
	siteTitle: siteTitle,
	docTitle: "Admin Update",
	docDescription: `${siteTitle} administration page to update`,
	title: "Admin Update",
	subTitle: `${siteTitle} administration page to update`,
}

router.get("/admin-update", (req, res) => {
	res.render("layouts/admin/adminCRUD", {
		links: menuLinks,
		titles: titles,
		files: filesArr,
		footerCopyright: footerCopyright,
		adminUpdate: true,
		adminCrud: true,
	})
})

router.post("/admin-update", (req, res) => {
	const {
		fileType,
		fileTitle,
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

	const updatedFile = fileTitle.split("/").pop().replace(".md", "")

	if (fileType === "page") {
		fs.writeFileSync(`${fileTitle}`, pageContents, "utf8")
		res.redirect(`/${updatedFile}`)
	} else {
		fs.writeFileSync(`${fileTitle}`, postContents, "utf8")
		res.redirect(`/${updatedFile}`)
	}
})

module.exports = router