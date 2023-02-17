const fileTypeSelect = document.getElementById("file-type-select")
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

fileTypeSelect.selectedIndex = 0
submitButton.classList.add("pure-button-disabled")

fileTypeSelect.addEventListener("change", (e) => {
	const fileTypeSelectValue = e.target.value

	editor.setMarkdown("")

	if (fileTypeSelectValue) {
		submitButton.classList.remove("pure-button-disabled")
	}

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

		// SET EDITOR CONTENT
		editor.setMarkdown(`## The Title

The title of your page will be the \`path\` part of the URL to this page.
For example, if you give your page the following tile :
\`title : My awesome page title\`
The URL to the page will be \`https://domain.name/my-awesome-page-title\`

So choose wisely your page's title the first time you create it !
⚠️ You'll be able to update the page's title but this will not change the page's URL !

## The content

Now remove all of this page's content, and start writing your next awesome page !
Use Markdown to write and format the markup of your page,
click on the preview tab to have an idea of the content's output.
Finally, click the submit button to create your new page 😉`)

		// MOVE CURSOR TO THE BEGINNING OF THE EDITOR
		editor.moveCursorToStart()

		// ALERT FOR PAGE CREATION
		submitButton.addEventListener("click", () => {
			Swal.fire({
				title: "Create a page ?!",
				html: `By clicking on <b>Create</b>,<br>a new <b>page</b> will be created,<br>with the content provided in the editor.`,
				icon: "question",
				showCancelButton: true,
				confirmButtonText: "Create",
				didOpen: () => {
					const b = Swal.getConfirmButton()
					b.type = "submit"
					b.setAttribute("form", "file-form")
				},
			})
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

		// SET EDITOR CONTENT
		editor.setMarkdown(`## The Title

The title of your post will be the \`path\` part of the URL to this post.
For example, if you give your post the following tile :
\`title : My awesome post title\`
The URL to the post will be \`https://domain.name/my-awesome-post-title\`

So choose wisely your post's title the first time you create it !
⚠️ You'll be able to update the post's title but this will not change the post's URL !

## Optional fields

The \`description\`, \`image\` and \`tag(s)\` fields are optional.
It means that you can leave any of them or all of them empty, it's totally up to you !

## The content

Now remove all of this post's content, and start writing your next awesome post !
Use Markdown to write and format the markup of your post,
click on the preview tab to have an idea of the content's output.
Finally, click the submit button to create your new page 😉`)

		// MOVE CURSOR TO THE BEGINNING OF THE EDITOR
		editor.moveCursorToStart()

		// ALERT FOR POST CREATION
		submitButton.addEventListener("click", () => {
			Swal.fire({
				title: "Create a post ?!",
				html: `By clicking on <b>Create</b>,<br>a new <b>post</b> will be created,<br>with the content provided in the editor.`,
				icon: "question",
				showCancelButton: true,
				confirmButtonText: "Create",
				didOpen: () => {
					const b = Swal.getConfirmButton()
					b.type = "submit"
					b.setAttribute("form", "file-form")
				},
			})
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

const fileForm = document.getElementById("file-form")
const textArea = document.getElementById("file-contents")
fileForm.addEventListener("submit", () => {
	const mdContent = editor.getMarkdown()
	textArea.value += mdContent
})
