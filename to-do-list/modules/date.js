exports.getDate = () => {
	// Get current date and format it
	const today = new Date();
	const options = {
		year: "numeric",
		month: "long",
		day: "numeric",
	};
	const formattedDate = today.toLocaleDateString("en-UK", options);

	return formattedDate;
};
