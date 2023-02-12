const router = global.router

const fs = require("fs")
const matter = require("gray-matter")
const glob = require("glob")

// Settings
const { menuLinks, footer } = require("../config/settings.json")

const config = fs.readFileSync("config/settings.json", "utf8", (err, data) => {
	if (err) throw err

	return data
})

const titles = {
	docTitle: "Administration",
	docDescription: "Bloc-Doc administration page",
	title: "Administration",
	subTitle: "Bloc-Doc administration page",
}

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

// Render all the posts from the list of posts on the archive route
router.get("/admin", async (req, res) => {
	//console.log(filesArr)
	res.render("layouts/admin", {
		links: menuLinks,
		titles: titles,
		files: filesArr,
		settings: config,
		admin: true,
		footer: footer,
	})
})

router.post("/admin", (req, res) => {
	const { actionType, fileType, fileTitle, fileContents } = req.body
	const file = matter(fileContents)

	if (actionType === "create") {
		const createdFileTitle = file.data.title
		const createdFileName = createdFileTitle
			.toLowerCase()
			.replace(/[^a-zA-Z0-9-_ ]/g, "")
			.replace(/\s+/g, "-")
		const createdFilePath = `${__dirname}/../views/${fileType}s`

		// Wait till the file gets created, then redirect to the newly created file.
		fs.promises.writeFile(`${createdFilePath}/${createdFileName}.md`, fileContents, "utf8").then(() => {
			res.redirect(`/${createdFileName}`)
		})
		res.redirect(`/${createdFileName}`)
	} else if (actionType === "update") {
		const updatedFile = fileTitle.split("/").pop().replace(".md", "")

		fs.writeFileSync(`${fileTitle}`, fileContents, "utf8")
		res.redirect(`/${updatedFile}`)
	} else if (actionType === "delete") {
		fs.unlink(`${fileTitle}`, (err) => {
			if (err) {
				throw err
			}

			// Update the files array by removing the deleted file from it before going back to admin route
			filesArr = filesArr.filter((item) => item.path !== `${fileTitle}`)
			console.log("File is deleted.")

			res.redirect(`/admin`)
		})
	}
})

router.post("/admin-config", (req, res) => {
	const { settings } = req.body

	fs.writeFileSync("config/settings.json", settings, "utf8")
	res.redirect("/admin")
})

module.exports = router
