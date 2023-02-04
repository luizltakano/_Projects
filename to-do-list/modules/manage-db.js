const mongoose = require("mongoose");

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
	},
});

const Task = mongoose.model("Task", taskSchema);

//Get tasks available depending on route
exports.getTasks = (route, res) => {
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
exports.addTaskToList = (list, task, res) => {
	const newTask = new Task(task);
	List.updateOne(
		{ name: list },
		{
			$push: {
				tasks: newTask,
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
exports.markTaskCompleted = (list, id, res) => {
	const closedAt = new Date();

	List.updateOne(
		{
			name: list,
			tasks: {
				$elemMatch: {
					id: id,
				},
			},
		},
		{
			$set: { "tasks.$.closedAt": closedAt },
		},
		{
			arrayFilters: [{ "tasks._id": id }],
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