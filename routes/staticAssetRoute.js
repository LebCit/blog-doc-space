import { drive } from "../functions/deta-drive.js"

function determineContentType(filename) {
	// Logic to determine the content type based on the file extension or other criteria
	if (filename.endsWith(".svg")) {
		return "image/svg+xml"
	} else if (filename.endsWith(".png")) {
		return "image/png"
	} else if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
		return "image/jpeg"
	} else if (filename.endsWith(".gif")) {
		return "image/gif"
	} else if (filename.endsWith(".avif")) {
		return "image/avif"
	} else if (filename.endsWith(".ico")) {
		return "image/x-icon"
	} else if (filename.endsWith(".webp")) {
		return "image/webp"
	}

	return "application/octet-stream" // Default to "application/octet-stream" if the content type cannot be determined
}

export function staticAssetRoute(app) {
	app.get("/static/:folder/:file", async (req, res) => {
		try {
			const { folder, file } = req.params
			const img = await drive.get(`${folder}/${file}`)
			const buffer = await img.arrayBuffer()

			// Determine the appropriate content type based on the file extension or other criteria
			const contentType = determineContentType(file)

			// Set the appropriate headers
			res.setHeader("Content-Type", contentType || "application/octet-stream")
			res.setHeader("Content-Length", buffer.byteLength)

			// Send the buffer as the response
			res.end(Buffer.from(buffer))
		} catch (error) {
			console.error("Error while retrieving image:", error.message)

			res.writeHead(500, { "Content-Type": "text/plain" })
			res.end("Internal Server Error")
		}
	})
}
