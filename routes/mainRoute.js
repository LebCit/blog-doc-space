import { Router } from "express"
const router = Router()

// Functions
import { paginator } from "../functions/paginator.js"
import { getPosts } from "../functions/getPosts.js"
const posts = await getPosts()

// Settings
import { settings } from "../config/settings.js"
const {
	siteTitle,
	siteDescription,
	featuredImage,
	menuLinks,
	postsPerPage,
	postPreviewFallbackImage,
	footerCopyright,
} = settings

const paginatedPosts = paginator(posts, 1, postsPerPage) // Paginate all the posts. Set the first page to 1 and X posts per page.
const newestPosts = paginatedPosts.data // Get the first X posts.
const lastPage = paginatedPosts.total_pages - 1 // Get the last page number by removing 1 from the total number of pages.
const postsLength = paginatedPosts.total // Get the total number of posts.

const titles = {
	siteTitle: siteTitle,
	docTitle: "Home",
	docDescription: siteDescription,
}

// Render, at most, the newest X posts from the list of posts on the main route.
export const mainRoute = router
	.get("/", (req, res) => {
		res.render(`layouts/base`, {
			mainRoute: true,
			links: menuLinks,
			titles: titles,
			posts: newestPosts,
			firstPage: true,
			lastPage: lastPage,
			paginated: postsLength > postsPerPage ? true : false, // To display or not the pagination component on the main route.
			featuredImage: featuredImage,
			postPreviewFallbackImage: postPreviewFallbackImage,
			footerCopyright: footerCopyright,
		})
	})

	// Dynamic route to display the list of posts without the newest X posts
	.get("/page/:actualBlogPage", (req, res) => {
		// Dynamic page number
		const actualBlogPage = req.params.actualBlogPage
		// Paginated array from the list of posts without the newest X posts
		const paginatedPostsList = paginator(posts.slice(postsPerPage), actualBlogPage, postsPerPage)

		res.render(`layouts/base`, {
			mainRoute: true,
			links: menuLinks,
			titles: titles,
			posts: paginatedPostsList.data,
			paginatedPostsList: paginatedPostsList,
			firstPage: false,
			lastPage: lastPage,
			paginated: true, // To display the pagination component on each blog page route
			featuredImage: featuredImage,
			postPreviewFallbackImage: postPreviewFallbackImage,
			footerCopyright: footerCopyright,
		})
	})
