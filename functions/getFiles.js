import { readdir } from "node:fs/promises"

export async function getFiles(dirName) {
	let files = []
	const items = await readdir(dirName, { withFileTypes: true })

	try {
		for (const item of items) {
			if (item.isDirectory()) {
				files = [...files, ...(await getFiles(`${dirName}/${item.name}`))]
			} else {
				files.push(`${dirName}/${item.name}`)
			}
		}
	} catch (error) {
		console.error(error)
	}

	return files
}
