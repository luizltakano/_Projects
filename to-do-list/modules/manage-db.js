// Connect to MongoDB with Mongoose
const mongoose = require("mongoose");

// Mongoose connection options params
const connectionParams = {
	useNewUrlParser: true,
	useUnifiedTopology: true
};

// Establish mongoose connection 
mongoose
	.connect(process.env.MONGO_URI, connectionParams)
	.then(() => {
		console.log("Database connected successfully");
	})
	.catch((error) => {
		console.log(error);
		console.log("Database connection failed");
	});

mongoose.set("strictQuery", true);

// Define List schema
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

// Define Task schema
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

// Get tasks based on route
exports.getTasks = (route, res) => {
	List.find({ name: route }, (err, list) => {
		if (err) {
			console.log(err);
		} else {
			const taskList = !list[0].tasks ? [] : list[0].tasks;
			res.render("list", {
				list: route.charAt(0).toUpperCase() + route.substr(1).toLowerCase(),
				itemsList: taskList,
			});
		}
	});
};

// Add task to list
exports.addTaskToList = (list, task, res) => {
	const newTask = new Task(task);
	List.updateOne({ name: list }, { $push: { tasks: newTask } }, (err) => {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/" + (list === "home" ? "" : list));
		}
	});
};

// Mark task as completed
exports.markTaskCompleted = (list, id, res) => {
	const closedAt = new Date();
	List.updateOne(
		{
			name: list,
			tasks: {
				$elemMatch: { id: id },
			},
		},
		{ $set: { "tasks.$.closedAt": closedAt } },
		{ arrayFilters: [{ "tasks._id": id }] },
		(err) => {
			if (err) {
				console.log(err);
			} else {
				res.redirect("/" + (list === "home" ? "" : list));
			}
		}
	);
};
