const express = require("express");
const { v4: uuid } = require("uuid");
require("dotenv").config();
const {
	getTasks,
	addTaskToList,
	markTaskCompleted,
} = require("./modules/manage-db");

const app = express();

// Set view engine and middleware
// Specify view engine as EJS
app.set("view engine", "ejs");

// Parse incoming request bodies in a middleware before handlers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static("public"));

// Route for main list page
// Renders the main list page
app.get("/", (req, res) => {
	// Call the getTasks function from manage-db module to get list tasks
	getTasks("home", res);
});

// Route for work list page
// Renders the work list page
app.get("/work", (req, res) => {
	// Call the getTasks function from manage-db module to get work tasks
	getTasks("work", res);
});

// Route to add items to main list or work list
app.post("/", (req, res) => {
	// Get item and form type from request body
	const item = String(req.body.newItem);
	const list = req.body.button.toLowerCase();
	const createdAt = new Date();
	const task = {
		title: item,
		createdAt: createdAt,
		closedAt: null,
		id: uuid(),
	};

	// Call the addTaskToList function from manage-db module to add task to the specified list
	addTaskToList(list, task, res);
});

// Route to delete items from main list or work list
app.post("/delete", (req, res) => {
	// Get the list name from the base URL of the referer header
	const baseUrl = req.headers.referer.substring(
		req.headers.referer.lastIndexOf("/") + 1
	);

	// Get the task id from the request body
	const taskId = req.body.checkbox;
	// Call the markTaskCompleted function from manage-db module to mark the specified task as completed
	markTaskCompleted(!baseUrl ? "home" : baseUrl, taskId, res);
});

// Start server on port 3000
app.listen(3000, () => console.log("Server started on port 3000"));
