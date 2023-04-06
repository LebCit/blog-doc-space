import { Router } from "express"
const router = Router()

import { exec } from "child_process"

import archiver from "archiver"

import { dirname } from "path"
import { fileURLToPath } from "url"
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const adminBuildAndDownloadRoute = router
	.get("/build", (req, res) => {
		exec("npm run build", (err, stdout, stderr) => {
			if (err) {
				console.error(`Error: ${err.message}`)
				return res.status(500).send(err.message)
			}
			console.log(`Build successful: ${stdout}`)
			res.redirect('/download')
		})
	})
	.get("/download", (req, res) => {
		const archive = archiver("zip")
		const output = res

		// Set the file name and content type for the response
		res.attachment("_site.zip")
		res.setHeader("Content-Type", "application/zip")

		// Get the path of the _site folder
		const sitePath = `${__dirname}/../../_site`

		// Add the _site folder to the archive
		archive.directory(sitePath, false)

		// Listen for errors and finalize the archive
		archive.on("error", (err) => {
			res.status(500).send({ error: err.message })
		})
		archive.finalize()

		// Pipe the archive to the response
		archive.pipe(output)
	})
