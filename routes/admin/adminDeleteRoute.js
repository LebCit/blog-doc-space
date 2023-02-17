const router = global.router

const fs = require("fs")
const matter = require("gray-matter")
const glob = require("glob")

// Settings
const { siteTitle, menuLinks, footerCopyright } = require("../../config/settings.json")

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

// ROUTE TO DELETE A PAGE OR A POST.
const titles = {
	siteTitle: siteTitle,
	docTitle: "Admin Delete",
	docDescription: `${siteTitle} administration page to delete`,
	title: "Admin Delete",
	subTitle: `${siteTitle} administration page to delete`,
}

router.get("/admin-delete", (req, res) => {
	res.render("layouts/admin/adminCRUD", {
		links: menuLinks,
		titles: titles,
		files: filesArr,
		footerCopyright: footerCopyright,
		adminDelete: true,
		adminCrud: true,
	})
})

router.post("/admin-delete", (req, res) => {
	const { fileTitle } = req.body
	fs.unlink(`${fileTitle}`, (err) => {
		if (err) {
			throw err
		}

		// Update the files array by removing the deleted file from it before going back to admin route
		filesArr = filesArr.filter((item) => item.path !== `${fileTitle}`)
		console.log("File is deleted.")

		res.redirect(`/admin`)
	})
})

module.exports = router
