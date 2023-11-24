import { getPages, getPosts } from "../functions/blog-doc.js"
import { getSettings } from "../functions/settings.js"

const pages = await getPages()
const posts = await getPosts()

export async function sitemap() {
	const settings = await getSettings()

	let urlsData = []

	/**
	 * This function loops through an array of posts,
	 * creates an object with the location of those posts,
	 * then add the created object to the urlsData array.
	 * This function is used for the main route, the archive route, the tags route and the blog routes.
	 */
	function postsObj(array, url) {
		// Create the object for those posts
		let postsObj = {
			urlLocation: url,
		}

		// Add the postsObj to the urlsData array.
		urlsData.push(postsObj)
	}

	// MAIN ROUTE
	const newestPosts = posts.slice(0, settings.postsPerPage) // Array of, at most, the newest X posts
	postsObj(newestPosts, settings.siteURL)

	// ARCHIVE ROUTE
	const archiveURL = settings.siteURL + "archive"
	postsObj(posts, archiveURL)

	// TAGS ROUTE
	const tagsURL = settings.siteURL + "tags"
	postsObj(posts, tagsURL)

	// BLOG ROUTES
	/**
	 * 1- Check if the array of posts is greater then postsPerPage.
	 * 2- Slice the array of posts into chunks of postsPerPage.
	 * 3- Remove the first chunk corresponding to the main route.
	 * 4- For each other chunk apply the postsObj() function.
	 */
	if (posts.length > settings.postsPerPage) {
		function sliceIntoChunks(arr, chunkSize) {
			const res = []
			for (let i = 0; i < arr.length; i += chunkSize) {
				const chunk = arr.slice(i, i + chunkSize)
				res.push(chunk)
			}
			return res
		}

		let slicedArray = sliceIntoChunks(posts, settings.postsPerPage)
		slicedArray.shift()

		slicedArray.forEach((arr, idx) => {
			let pageURL = `${settings.siteURL}page/${idx + 1}`
			postsObj(arr, pageURL)
		})
	}

	/**
	 * This function loops trough an array of files, and returns the location as an object.
	 * This function is used for all the pages and posts.
	 */
	function filesObj() {
		let files = pages.concat(posts)

		files.forEach((file) => {
			const fileTitle = file[0].replace(/\.[^/.]+$/, "")

			const fileDir = file.dir

			let fileObj = {
				urlLocation: `${settings.siteURL + fileDir}/${fileTitle}`,
			}

			urlsData.push(fileObj)
		})
	}
	filesObj()

	// EACH TAG ROUTE
	function tagObj() {
		const allTagsArray = posts.flatMap((post) => post[1].frontmatter.tags).sort()

		// Remove duplicates from tagsArray using a Set
		const tagsArray = [...new Set(allTagsArray)]

		tagsArray.forEach((tag) => {
			let tagObj = {
				urlLocation: settings.siteURL + "tags/" + tag,
			}

			urlsData.push(tagObj)
		})
	}
	tagObj()

	return urlsData
}
