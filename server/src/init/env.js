module.exports = function () {
	if (!process.env.JWT_PRIVATE_KEY)
		throw new Error("FATAL ERROR, env variable JWT_PRIVATE_KEY is not defined");
	// TODO: do it different way
	if (process.env.NODE_ENV === "test")
		return;
	if (!process.env.DB_URL)
		throw new Error("FATAL ERROR, env variable DB_URL is not defined");
}