const express = require("express");
const app = express();

// Item arrays
const items = [];
const workItems = [];

// Set view engine and middleware
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Route for main list page
app.get("/", (req, res) => {
	// Get current date and format it
	const today = new Date();
	const options = {
		year: "numeric",
		month: "long",
		day: "numeric",
	};
	const formattedDate = today.toLocaleDateString("en-UK", options);

	// Render list page with current date and items list
	res.render("list", { list: formattedDate, itemsList: items });
});

// Route for work list page
app.get("/work", (req, res) => {
	// Render list page with "Work List" title and work items list
	res.render("list", { list: "Work List", itemsList: workItems });
});

// Route to add items to main list or work list
app.post("/", (req, res) => {
	// Get item and form type from request body
	const item = req.body.newItem;
	const form = req.body.button;

	// Add item to work list or main list
	if (form === "Work") {
		workItems.push(item);
		res.redirect("/work");
	} else {
		items.push(item);
		res.redirect("/");
	}
});

// Route to add items to work list
app.post("/work", (req, res) => {
	// Get item from request body
	const item = req.body.newItem;

	// Add item to work list
	workItems.push(item);
	res.redirect("/work");
});

// Start server on port 3000
app.listen(3000, () => console.log("Server started on port 3000"));
