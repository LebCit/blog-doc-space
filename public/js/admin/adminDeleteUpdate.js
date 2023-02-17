const files = document.getElementById("files")
const filesArray = JSON.parse(files.textContent)
files.remove()

const fileTypeSelect = document.getElementById("file-type-select")
const fileTitleSelect = document.getElementById("file-title-select")
const fileTitleSelectDiv = document.getElementById("file-title-select-div")
const pageFrontMatterDiv = document.getElementById("page-front-matter")
const postFrontMatterDiv = document.getElementById("post-front-matter")

const editor = new toastui.Editor({
	autofocus: false,
	el: document.querySelector("#editor"),
	frontMatter: true,
	previewStyle: "tab",
	height: "500px",
	initialEditType: "markdown",
	hideModeSwitch: true,
})

const submitButton = document.getElementById("submit-button")

// RESET THE FILE TYPE SELECT
fileTypeSelect.selectedIndex = 0
submitButton.classList.add("pure-button-disabled")

// REMOVES ALL OPTIONS FROM FileTitleSelect EXCEPT THE FIRST ONE
function clearFileTitleSelect() {
	while (fileTitleSelect.options.length > 1) {
		fileTitleSelect.remove(1)
	}
}

fileTypeSelect.addEventListener("change", (e) => {
	const fileTypeSelectValue = e.target.value

	// CLEAR THE FILE TITLE SELECT IF THE FILE TYPE SELECT CHANGES
	clearFileTitleSelect()

	fileTitleSelectDiv.classList.remove("hidden")
	fileTitleSelect.setAttribute("required", "")

	document.getElementById("page-title-input").value = ""
	document.getElementById("page-description-input").value = ""
	document.getElementById("post-title-input").value = ""
	document.getElementById("post-date-input").value = ""
	document.getElementById("post-description-input").value = ""
	document.getElementById("post-image-input").value = ""
	document.getElementById("post-tags-input").value = ""

	editor.setMarkdown("")

	if (fileTypeSelectValue === "page") {
		// SHOW PAGE FRONT MATTER
		pageFrontMatterDiv.classList.remove("hidden")
		const pageFrontMatterDivChildren = pageFrontMatterDiv.children
		for (let input of pageFrontMatterDivChildren) {
			input = input.lastElementChild
			input.setAttribute("required", "")
		}

		// HIDE POST FRONT MATTER
		postFrontMatterDiv.classList.add("hidden")
		const postFrontMatterDivChildren = postFrontMatterDiv.children
		for (let index = 0; index < 2; index++) {
			const input = postFrontMatterDivChildren[index].lastElementChild
			input.removeAttribute("required")
		}

		// POPULATE THE FILE TITLE SELECT WITH THE AVAILABLE PAGES
		const pages = filesArray.filter((file) => file.path.startsWith("views/pages/"))
		// Sort pages alphabetically
		pages.sort((a, b) => {
			let fa = a.data.title.toLowerCase(),
				fb = b.data.title.toLowerCase()

			if (fa < fb) {
				return -1
			}
			if (fa > fb) {
				return 1
			}
			return 0
		})
		pages.forEach((page) => {
			let newOption = new Option(page.data.title, page.path)
			fileTitleSelect.add(newOption)
		})
	} else if (fileTypeSelectValue === "post") {
		// HIDE THE PAGE FRONT MATTER
		pageFrontMatterDiv.classList.add("hidden")
		const pageFrontMatterDivChildren = pageFrontMatterDiv.children
		for (let input of pageFrontMatterDivChildren) {
			input = input.lastElementChild
			input.removeAttribute("required")
		}

		// SHOW THE POST FRONT MATTER
		postFrontMatterDiv.classList.remove("hidden")
		const postFrontMatterDivChildren = postFrontMatterDiv.children
		for (let index = 0; index < 2; index++) {
			const input = postFrontMatterDivChildren[index].lastElementChild
			input.setAttribute("required", "")
		}

		const posts = filesArray.filter((file) => file.path.startsWith("views/posts/"))
		posts.forEach((post) => {
			let newOption = new Option(post.data.title, post.path)
			fileTitleSelect.add(newOption)
		})
	} else {
		submitButton.classList.add("pure-button-disabled")

		// HIDE THE PAGE FRONT MATTER
		pageFrontMatterDiv.classList.add("hidden")
		const pageFrontMatterDivChildren = pageFrontMatterDiv.children
		for (let input of pageFrontMatterDivChildren) {
			input = input.lastElementChild
			input.removeAttribute("required")
		}

		// HIDE POST FRONT MATTER
		postFrontMatterDiv.classList.add("hidden")
		const postFrontMatterDivChildren = postFrontMatterDiv.children
		for (let index = 0; index < 2; index++) {
			const input = postFrontMatterDivChildren[index].lastElementChild
			input.removeAttribute("required")
		}
	}
})

fileTitleSelect.addEventListener("change", (e) => {
	const fileTitleSelectValue = e.target.value

	document.getElementById("page-title-input").value = ""
	document.getElementById("page-description-input").value = ""
	document.getElementById("post-title-input").value = ""
	document.getElementById("post-date-input").value = ""
	document.getElementById("post-description-input").value = ""
	document.getElementById("post-image-input").value = ""
	document.getElementById("post-tags-input").value = ""

	editor.setMarkdown("")

	if (fileTitleSelectValue) {
		submitButton.classList.remove("pure-button-disabled")

		// GET THE SELECTED FILE FROM IT'S VALUE (THE PATH)
		const selectedFile = filesArray.find((file) => file.path === fileTitleSelectValue)

		// APPEND FRONT MATTER VALUE ACCORDING TO THE SELECTED FILE
		if (selectedFile.path.startsWith("views/pages/")) {
			document.getElementById("page-title-input").value = selectedFile.data.title
			document.getElementById("page-description-input").value = selectedFile.data.subTitle
		} else if (selectedFile.path.startsWith("views/posts/")) {
			document.getElementById("post-title-input").value = selectedFile.data.title
			document.getElementById("post-date-input").value = selectedFile.data.date.split("/").join("-")
			selectedFile.data.description
				? (document.getElementById("post-description-input").value = selectedFile.data.description)
				: (document.getElementById("post-description-input").value = "")

			selectedFile.data.featuredImage
				? (document.getElementById("post-image-input").value = selectedFile.data.featuredImage)
				: (document.getElementById("post-image-input").value = "")
			selectedFile.data.tags
				? (document.getElementById("post-tags-input").value = selectedFile.data.tags.toString())
				: (document.getElementById("post-tags-input").value = "")
		}

		// SET EDITOR CONTENT TO FILE CONTENT
		editor.setMarkdown(selectedFile.content)
	} else {
		submitButton.classList.add("pure-button-disabled")
	}

	if (window.location.pathname === "/admin-update") {
		submitButton.addEventListener("click", () => {
			Swal.fire({
				title: "Update a page/post ?!",
				html: `By clicking on <b>Update</b>,<br>the <b>page/post</b> will be updated,<br>with the content provided in the editor.`,
				icon: "question",
				showCancelButton: true,
				confirmButtonText: "Update",
				didOpen: () => {
					const b = Swal.getConfirmButton()
					b.type = "submit"
					b.setAttribute("form", "file-form")
				},
			})
		})
	}

	if (window.location.pathname === "/admin-delete") {
		submitButton.addEventListener("click", () => {
			Swal.fire({
				title: "Delete a page/post ?!",
				html: `By clicking on <b>Delete</b>,<br>the <b>page/post</b> will be deleted,<br>this is IRREVERSIBLE !.<br>This file will be FOREVER LOST if you proceed !`,
				icon: "warning",
				showCancelButton: true,
				confirmButtonText: "Delete",
				didOpen: () => {
					const b = Swal.getConfirmButton()
					b.type = "submit"
					b.setAttribute("form", "file-form")
				},
			})
		})
	}
})

const fileForm = document.getElementById("file-form")
const textArea = document.getElementById("file-contents")
fileForm.addEventListener("submit", () => {
	const mdContent = editor.getMarkdown()
	textArea.value += mdContent
})
