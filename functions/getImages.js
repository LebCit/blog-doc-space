import { getFiles } from "./getFiles.js"

export async function getImages() {
	let imagesFiles = await getFiles("public/images")
	imagesFiles = imagesFiles.filter(
		(image) =>
			image !== "public/images/404-not-found-error.png" && image !== "public/images/500-internal-server-error.png"
	)

	let images = []
	imagesFiles.forEach((image) => {
		image = image.replace("public", "")
		images.push(image)
	})
	return images
}
