import { join } from "path"
import { Router } from "./router.js"
import { Eta } from "eta"

export function initializeApp() {
	const app = new Router()
	const eta = new Eta({ views: join(process.cwd(), "views") })

	return { app, eta }
}
