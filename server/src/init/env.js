module.exports = function () {
	if (process.env.NODE_ENV === "test") return;
	if (!process.env.DB_URL)
		throw new Error("FATAL ERROR, env variable DB_URL is not defined");
}