import { drive } from "./deta-drive.js"
import { initializeApp } from "./initialize.js"

export async function getSettings() {
	try {
		let settings = await drive.get("config/settings.json")
		const buffer = await settings.arrayBuffer()
		const textContent = new TextDecoder().decode(buffer)
		// Since v5.1.0 to allow favicon replacement
		const settingsObj = JSON.parse(textContent)
		Object.hasOwn(settingsObj, "favicon") ? settingsObj : (settingsObj.favicon = "icons/favicon.ico")
		return settingsObj
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
