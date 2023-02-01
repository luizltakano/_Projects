const express = require("express");

const app = express();

const items = [];

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
	const today = new Date();
	const currentDate = today.getDate();

	const options = {
		year: "numeric",
		month: "long",
		day: "numeric",
	};
	const formattedDate = today.toLocaleDateString("en-UK", options);

	res.render("list", { date: formattedDate, itemsList: items });
});

app.post("/new-item", (req, res) => {
	const item = req.body.newItem;
	items.push(item);
	res.redirect("/");
});

app.listen(3000, () => console.log("Server started on port 3000"));
