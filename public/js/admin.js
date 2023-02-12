// CREATE, UPDATE, DELETE.
const files = document.getElementById("files")
const filesArray = JSON.parse(files.textContent)
files.remove()

const fileForm = document.getElementById("file-form")
fileForm.reset()

const actionSelect = document.getElementById("action-select")
const fileTypeSelect = document.getElementById("file-type-select")
const fileTitleSelect = document.getElementById("file-title-select")
const textArea = document.getElementById("file-contents")
const submitButton = document.getElementById("submit-button")

const fileTitleSelectDiv = document.getElementById("file-title-select-div")

const editor = new toastui.Editor({
	el: document.querySelector("#editor"),
	frontMatter: true,
	previewStyle: "tab",
	height: "500px",
	initialEditType: "markdown",
	hideModeSwitch: true,
})

// Reset fileTypeSelect
function resetFileTypeSelect() {
	fileTypeSelect.selectedIndex = 0
}

// Removes all options from fileTitleSelect except the first one
function clearFileTitleSelect() {
	while (fileTitleSelect.options.length > 1) {
		fileTitleSelect.remove(1)
	}
}

submitButton.classList.add("pure-button-disabled")

actionSelect.addEventListener("change", (e) => {
	const actionSelectValue = e.target.value
	clearFileTitleSelect()
	resetFileTypeSelect()
	submitButton.classList.add("pure-button-disabled")

	if (actionSelectValue === "create") {
		/* textArea.value = "" */
		editor.setMarkdown("")
		fileTitleSelectDiv.classList.add("hidden")
		fileTitleSelect.removeAttribute("required", "")
		clearFileTitleSelect()

		fileTypeSelect.addEventListener("change", (e) => {
			const fileTypeSelectValue = e.target.value
			/* textArea.value = "" */
			editor.setMarkdown("")

			if (fileTypeSelectValue === "page" && fileTitleSelectDiv.classList.contains("hidden")) {
				clearFileTitleSelect()
				submitButton.classList.remove("pure-button-disabled")

				editor.setMarkdown(`---
title: Type your page title here (Mandatory field !)
subTitle: Describe your page's content shortly (Mandatory field !)
---

## The front matter

**DO NOT REMOVE THE FRONT MATTER !**
The front matter is the data beginning from the first three hyphens till the last three hyphens :

\`\`\`yaml
---
title: This is the title of my page
subTitle: This is the short description of my page's content
---
\`\`\`

Now give your page a title and a subTitle in the front matter.

## The Title

The title of your page will be the \`path\` part of the URL to this page.
For example, if you give your page the following tile :
\`title : My awesome page title\`
The URL to the page will be \`https://domain.name/my-awesome-page-title\`

⚠️ You'll be able to update the page's title but this will not change the page's URL !

## The content

The content starts right after the last three hyphens of the front matter.
Now remove all of this page's content, and start writing your next awesome page !
Use Markdown to write and format the markup of your page,
click on the preview tab to have an idea of the content's output.
Finally, click the submit button to create your new page 😉`)

				/* textArea.value +=
					"---\ntitle: Give your page a title = MANDATORY!!!\nsubTitle: Describe your page's content shortly = MANDATORY!!!\n---\nDO NOT REMOVE THE FRONT-MATTER !!!\nRemove all of this content and start writing your next awesome page using Markdown !" */

				submitButton.addEventListener("click", function pageAlert() {
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
					submitButton.removeEventListener("click", pageAlert)
				})
			} else if (fileTypeSelectValue === "post" && fileTitleSelectDiv.classList.contains("hidden")) {
				clearFileTitleSelect()
				submitButton.classList.remove("pure-button-disabled")

				editor.setMarkdown(`---
title: Type your post title here (Mandatory field !)
date: 2023/02/10 Replace this date by yours in the same format : YYYY/MM/DD (Mandatory field !)
description: Describe your post's content shortly (Optional field, but better for SEO)
featuredImage: https://url-to-the-post-image (Optional field, but better for design)
tags: [HTML, CSS, JS, Another-Tag] (Optional field, but better for categorizing)
---

It's a good practice to begin your post content by an introduction that expands a little bit on the post's content,
like an introduction of the subject you're about to talk about.
From this introduction will be created the post's short description that appears in the blog...

## The front matter

**DO NOT REMOVE THE FRONT MATTER !**
The front matter is the data beginning from the first three hyphens till the last three hyphens :

\`\`\`yaml
---
title: This is the title of my post
date: 2023/02/10
description: This is the short description of my page's content
featuredImage: https://images.pexels.com/photos/1827548/pexels-photo-1827548.jpeg
tags: [Coffee, Mood, Wall-Decor]
---
\`\`\`

Now give your post a title and a date in the front matter.

## The Title

The title of your post will be the \`path\` part of the URL to this post.
For example, if you give your post the following tile :
\`title : My awesome post title\`
The URL to the post will be \`https://domain.name/my-awesome-post-title\`

⚠️ You'll be able to update the post's title but this will not change the post's URL !

## Optional fields

The \`description\`, \`featuredImage\` and \`tags\` fields are optional.
It means that you can remove any of them or all of them from the front matter,
or leave any of them or all of them empty, it's totally up to you !

## The content

The content starts right after the last three hyphens of the front matter.
Now remove all of this post's content, and start writing your next awesome post !
Use Markdown to write and format the markup of your post,
click on the preview tab to have an idea of the content's output.
Finally, click the submit button to create your new page 😉`)
				/* textArea.value +=
					"---\ntitle: Give your post a title = MANDATORY!!!\ndate: Give your post a date like 2023/09/02 = MANDATORY!!!\ndescription: Describe your post's content shortly = OPTIONAL but better for SEO\nfeaturedImage: https://url-to-the-post-image = OPTIONAL\ntags: [HTML, CSS, JS, Another-Tag, Tags-Are-OPTIONAL]\n---\nDO NOT REMOVE THE FRONT-MATTER !!!\nYou can completely remove any of description, featuredImage or tags, or just leave any of them empty if you don't want to use it.\nNow remove all of this content and start writing your next awesome post using Markdown !" */

				submitButton.addEventListener("click", function postAlert() {
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
					submitButton.removeEventListener("click", postAlert)
				})
			} else {
				submitButton.classList.add("pure-button-disabled")
			}
		})
	} else if (actionSelectValue === "update" || actionSelectValue === "delete") {
		/* textArea.value = "" */
		editor.setMarkdown("")
		fileTitleSelectDiv.classList.remove("hidden")
		fileTitleSelect.setAttribute("required", "")
		submitButton.classList.add("pure-button-disabled")

		fileTypeSelect.addEventListener("change", (e) => {
			const fileTypeSelectValue = e.target.value
			/* textArea.value = "" */
			editor.setMarkdown("")

			if (fileTypeSelectValue === "page") {
				clearFileTitleSelect()

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
				clearFileTitleSelect()

				const posts = filesArray.filter((file) => file.path.startsWith("views/posts/"))
				posts.forEach((post) => {
					let newOption = new Option(post.data.title, post.path)
					fileTitleSelect.add(newOption)
				})
			}
		})

		fileTitleSelect.addEventListener("change", (e) => {
			const fileTitleSelectValue = e.target.value
			/* textArea.value = "" */
			editor.setMarkdown("")
			submitButton.classList.add("pure-button-disabled")

			if (fileTitleSelect.options[fileTitleSelect.selectedIndex].value) {
				submitButton.classList.remove("pure-button-disabled")
			}

			const selectedFile = filesArray.find((file) => file.path === fileTitleSelectValue)

			/* textArea.value += selectedFile.fileContents */
			editor.setMarkdown(selectedFile.fileContents)

			if (actionSelectValue === "update") {
				submitButton.addEventListener("click", function update() {
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
					submitButton.removeEventListener("click", update)
				})
			} else if (actionSelectValue === "delete") {
				submitButton.addEventListener("click", function del() {
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
					submitButton.removeEventListener("click", del)
				})
			}
		})
	} else {
		editor.setMarkdown("")
		submitButton.classList.add("pure-button-disabled")
	}
})

fileForm.addEventListener("submit", () => {
	const mdContent = editor.getMarkdown()
	textArea.value += mdContent
})

// MODIFY THE CONFIGURATION
const submitConfigButton = document.getElementById("submit-config-button")

submitConfigButton.addEventListener("click", () => {
	Swal.fire({
		title: "Modify The Configuration ?!",
		html: `By clicking on <b>Modify</b>,<br>the <b>Configuration</b> will be modified !<br>Validate the JSON object before submitting,<br>otherwise your application could break !`,
		icon: "warning",
		showCancelButton: true,
		confirmButtonText: "Modify",
		didOpen: () => {
			const b = Swal.getConfirmButton()
			b.type = "submit"
			b.setAttribute("form", "config-form")
		},
	})
})
