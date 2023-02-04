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
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Route for main list page
app.get("/", (req, res) => {
	getTasks("home", res);
});

// Route for work list page
app.get("/work", (req, res) => {
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

	addTaskToList(list, task, res);
});

// Route to delete items from main list or work list
app.post("/delete", (req, res) => {
	const baseUrl = req.headers.referer.substring(
		req.headers.referer.lastIndexOf("/") + 1
	);

	const taskId = req.body.checkbox;
	markTaskCompleted(!baseUrl ? "home" : baseUrl, taskId, res);

	// Task.findByIdAndRemove(taskId, (err) => {
	// 	if (err) {
	// 		console.log(err);
	// 	} else {
	// res.redirect("/" + baseUrl);
	// 	}
	// });
});

// Start server on port 3000
app.listen(3000, () => console.log("Server started on port 3000"));
