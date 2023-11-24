if (!process.env.DETA_SPACE_APP) {
	const dotenv = await import("dotenv/config.js")
	dotenv
}

import { Deta } from "deta"
const deta = Deta(process.env.BLOG_DOC_TOKEN)
export const drive = deta.Drive("blog-doc-drive")
