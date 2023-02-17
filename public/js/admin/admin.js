if (window.location.pathname === "/admin-create") {
	await import("./adminCreate.js")
} else if (window.location.pathname === "/admin-config") {
	await import("./adminConfig.js")
} else {
	await import("./adminDeleteUpdate.js")
}