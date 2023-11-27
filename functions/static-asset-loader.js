import { readFileSync, readdirSync, statSync } from "fs"
import path from "path"

class StaticAssetLoader {
	constructor(directory) {
		this.directory = directory
		this.staticAssets = this.getFiles(directory)
	}

	// Method to get files from their directory recursively.
	getFiles(dirName) {
		let files = []
		const items = readdirSync(dirName, { withFileTypes: true })

		for (const item of items) {
			if (item.isDirectory()) {
				files = [...files, ...this.getFiles(`${dirName}/${item.name}`)]
			} else {
				files.push(`${dirName}/${item.name}`)
			}
		}

		return files
	}

	// Method to support different content types.
	getContentType(file) {
		const extname = path.extname(file)
		if (extname === ".css") {
			return "text/css"
		} else if (extname === ".js" || extname === ".mjs") {
			return "application/javascript"
		} else if (extname === ".png") {
			return "image/png"
		} else if (extname === ".jpg" || extname === ".jpeg") {
			return "image/jpeg"
		} else if (extname === ".gif") {
			return "image/gif"
		} else if (extname === ".avif") {
			return "image/avif"
		} else if (extname === ".svg") {
			return "image/svg+xml"
		} else if (extname === ".ico") {
			return "image/x-icon"
		} else if (extname === ".webp") {
			return "image/webp"
		}
		return "application/octet-stream" // Default to binary data if the content type is not recognized
	}

	// Method to serve static assets.
	serveStaticAssets(app) {
		this.staticAssets.forEach((el) => {
			app.get(`/${el}`, (req, res) => {
				const filePath = path.join(process.cwd(), `/${el}`)

				try {
					const stats = statSync(filePath)
					if (stats.isFile()) {
						const contentType = this.getContentType(filePath)
						res.setHeader("Content-Type", contentType)

						const fileContents = readFileSync(filePath)
						res.end(fileContents)
					} else {
						// If it's not a file, send a 404 Not Found response.
						res.end("Not Found")
					}
				} catch (err) {
					console.error(`Error while serving file: ${err.message}`)

					res.writeHead(302, { Location: "/500" })
					res.end()
					return
				}
			})
		})
	}
}

export const staticAssetLoader = new StaticAssetLoader("static")
