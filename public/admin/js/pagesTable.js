const pagesData = document.getElementById("pages-data")
const data = JSON.parse(pagesData.textContent)
console.log(data)
pagesData.remove()

const table = new Tabulator("#admin-table", {
	data: data,
	layout: "fitDataFill",
	pagination: true,
	paginationSize: 5,
	paginationSizeSelector: true,
	columns: [
		{ formatter: "rownum", hozAlign: "center", width: 40, headerSort: false },
		{
			title: "Title",
			field: "1.data.title",
			cellClick: function (e, cell) {
				console.log(cell.getRow().getData())
			},
			formatter: "link",
			formatterParams: {
				url: function (cell) {
					return `/admin-update/${cell.getRow().getData()[0].replace(".md", "")}`
				},
			},
			headerFilter: true,
			headerFilterPlaceholder: "Find a Page...",
		},
		{ title: "Description", field: "1.data.description" },
		{
			formatter: function () {
				return "<button class='pure-button delete-button'>&#10008; DELETE !</button>"
			},
			cellClick: function (e, cell) {
				const postData = cell.getRow().getData()
				const filePath = postData[1].path.split("../").pop()

				Swal.fire({
					title: `Delete ${postData[1].data.title} ?!`,
					html: `By clicking on <b>Delete</b>,
					<br />
					<b>${postData[1].data.title}</b> will be deleted,
					<br />
					this is IRREVERSIBLE !
					<br />
					This file will be FOREVER LOST if you proceed !
					<form class="d-none" id="delete-form" action="/delete/${postData[0].replace(".md", "")}" method="post">
					<input type="text" name="filePath" id="file-path" value="${filePath}" />
					</form>`,
					icon: "warning",
					showCancelButton: true,
					confirmButtonText: "Delete",
					didOpen: () => {
						const deleteForm = document.getElementById("delete-form")
						const b = Swal.getConfirmButton()
						b.type = "button"
						b.addEventListener("click", () => {
							deleteForm.submit()
						})
					},
				})
			},
			headerSort: false,
		},
	],
})
