if (window.location.pathname === "/admin-create") {
	await import("./adminCreate.js")
} else if (window.location.pathname === "/admin-config") {
	await import("./adminConfig.js")
} else if (window.location.pathname.startsWith("/admin-pages")) {
	await import("./pagesTable.js")
} else if (window.location.pathname.startsWith("/admin-posts")) {
	await import("./postsTable.js")
} else {
	await import("./adminUpdate.js")
}