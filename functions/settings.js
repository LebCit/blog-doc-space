import { drive } from "./deta-drive.js"
import { initializeApp } from "./initialize.js"

export async function getSettings() {
	try {
		let settings = await drive.get("config/settings.json")
		const buffer = await settings.arrayBuffer()
		const textContent = new TextDecoder().decode(buffer)
		return JSON.parse(textContent)
	} catch (error) {
		console.error("Error while retrieving settings:", error.message)

		const { app } = initializeApp()
		app.get("/", (req, res) => {
			res.writeHead(302, { Location: "/500" })
			res.end()
			return
		})
	}
}
