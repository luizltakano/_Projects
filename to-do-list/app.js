const express = require("express");
const mongoose = require("mongoose");
const { v4: uuid } = require("uuid")
require("dotenv").config();

const app = express();

// Set view engine and middleware
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(process.env.PROD_PORT, {
	useNewUrlParser: true,
});

mongoose.set("strictQuery", true);

//List schema to be udpated with tasks
const listSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true],
	},
	tasks: Array,
	id: {
		type: String,
		required: true,
		unique: true,
	},
});

const List = mongoose.model("List", listSchema);

//Task schema to create and delete tasks
const taskSchema = mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	createdAt: Date,
	closedAt: Date,
	id: {
		type: String,
		required: true,
		unique: true,
	}
});

const Task = mongoose.model("Task", taskSchema);

//Get tasks available depending on route
const getTasks = (route, res) => {
	List.find(
		{
			name: route,
		},
		(err, list) => {
			if (err) {
				console.log(err);
			} else {
				const taskList = !list[0].tasks ? [] : list[0].tasks;
				// Render list page with current date and items list
				res.render("list", {
					list: route.charAt(0).toUpperCase() + route.substr(1).toLowerCase(),
					itemsList: taskList,
				});
			}
		}
	);
};

//Add tasks to a list
const addTaskToList = (list, task, res) => {
	List.updateOne(
		{ name: list },
		{
			$push: {
				tasks: task,
			},
		},
		(err) => {
			if (err) {
				console.log(err);
			} else {
				res.redirect("/" + (list === "home" ? "" : list));
			}
		}
	);
};

//Mark task as completed
const markTaskCompleted = (list, id, res) => {
	const closedAt = new Date();
	console.log(list);
	console.log(id);

	List.updateOne(
		{
			name: list,
			tasks: {
				$elemMatch: {
					id: id
				},
			},
		},
		{
			$set: { "tasks.$.closedAt": closedAt },
		},
		{
			arrayFilters: [{ "tasks._id": id }],
		},
		(err, testlist) => {
			if (err) {
				console.log(err);
			} else {
				console.log(testlist, "testlist");
				res.redirect("/" + (list === "home" ? "" : list));
			}
		}
	);
};

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
	const task = new Task({
		title: item,
		createdAt: createdAt,
		closedAt: null,
		id: uuid()
	});

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
