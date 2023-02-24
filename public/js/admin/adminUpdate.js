const fileString = document.getElementById("file")
const file = JSON.parse(fileString.textContent)
fileString.remove()

const editor = new toastui.Editor({
	autofocus: false,
	el: document.querySelector("#editor"),
	frontMatter: true,
	previewStyle: "tab",
	height: "500px",
	initialEditType: "markdown",
	hideModeSwitch: true,
})

// SET EDITOR CONTENT TO FILE CONTENT
editor.setMarkdown(file[1].content)

// MOVE CURSOR TO THE BEGINNING OF THE EDITOR
editor.moveCursorToStart()

const submitButton = document.getElementById("submit-button")

submitButton.addEventListener("click", () => {
	Swal.fire({
		title: `Update "${file[1].data.title}" ?!`,
		html: `By clicking on <b>Update</b>,<br><b>"${file[1].data.title}"</b> will be updated,<br>with the provided data.`,
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

const fileForm = document.getElementById("file-form")
const textArea = document.getElementById("file-contents")
fileForm.addEventListener("submit", () => {
	const mdContent = editor.getMarkdown()
	textArea.value += mdContent
})
