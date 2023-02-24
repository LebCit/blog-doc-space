const fs = require("fs")
const matter = require("gray-matter")

module.exports = () => {
	// Get the pages from their directory
	const pages = fs.readdirSync(`${__dirname}/../views/pages`).filter((page) => page.endsWith(".md"))
	// Set the page content as an empty array
	const pageContent = []
	// Inject into the page content array the front matter
	pages.forEach((page) => {
		pageContent.push(matter.read(`${__dirname}/../views/pages/${page}`))
	})

	/**
	 * 1- Return a list of pages as a two dimensional array containing for each one :
	 * . the page filename with it's extension (e.g : pageFilename.md)
	 * . the page content as an object {content:"Markdown content as a string", data:{front matter}, excerpt:""}
	 * 2- Return each array as an object
	 */
	const pagesList = pages
		.map((page, i) => {
			return [page, pageContent[i]]
		})
		.map((obj) => {
			return { ...obj }
		})

	return pagesList
}
