import { Router } from "express"
const router = Router()

import { unlink } from "node:fs/promises"
import { formidable } from "formidable"

import { dirname } from "path"
import { fileURLToPath } from "url"
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Functions
import { getImages } from "../../functions/getImages.js"
//let images = await getImages()

// Settings
import { settings } from "../../config/settings.js"
const { siteTitle, footerCopyright } = settings

// ROUTE TO MODIFY THE APP SETTINGS.
const titles = {
	siteTitle: siteTitle,
	docTitle: "Images gallery",
	docDescription: `${siteTitle} gallery page`,
}

export const adminGalleryRoute = router
	.get("/admin-gallery", async (req, res) => {
		res.render("layouts/admin/adminGallery", {
			adminGallery: true,
			titles: titles,
			images: await getImages(),
			footerCopyright: footerCopyright,
		})
	})
	.post("/add-image", async (req, res, next) => {
		const form = formidable({
			multiples: true,
			uploadDir: `${__dirname}/../../public/images`,
			// Use it to control newFilename.
			filename: (name, ext, part, form) => {
				return part.originalFilename // Will be joined with options.uploadDir.
			},
		})

		form.parse(req, (err, fields, files) => {
			if (err) {
				next(err)
				return
			}
		})

		// RESET THE IMAGES ARRAY BEFORE GOING BACK TO THE GALLERY.
		//images = await getImages()
		res.redirect("/admin-gallery")
	})
	.post("/delete-image", async (req, res) => {
		const { imageName } = req.body
		const imagePath = `${__dirname}/../../public/images/${imageName}`
		// Promise-based operations return a promise that is fulfilled when the asynchronous operation is complete.
		try {
			await unlink(`${imagePath}`)
			// RESET THE IMAGES ARRAY BEFORE GOING BACK TO THE GALLERY.
			//images = await getImages()
			res.redirect("/admin-gallery")
		} catch (error) {
			console.error("there was an error:", error.message)
		}
	})
