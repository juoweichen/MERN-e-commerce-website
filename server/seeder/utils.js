module.exports.getDb = () => {
	// Get DB_URL from env var
	const dbUrl = process.env.DB_URL;
	if (!dbUrl)
		throw new Error('DB_URL not found');

	// Extract db name from DB_URL
	const dbName = dbUrl.match(/(?<=.net\/)(.*?)(?=\?)/)[0];
	if (!dbName.match(/test/i))
		throw new Error('WRANING: you are reseeding prod db!');
	console.log(`current db: `, dbName)

	return dbUrl;
}