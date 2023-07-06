const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const uuid = require("uuid");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Functions
function readDataFile() {
  const data = fs.readFileSync("./todos.json", "utf-8");
  return JSON.parse(data);
}

function writeDataFile(data) {
  fs.writeFileSync("./todos.json", JSON.stringify(data, null, 2));
}

app.get("/todos", (req, res) => {
  try {
    const data = readDataFile();
    res.send(data);
  } catch (err) {
    res.status(404).json({ Error: "Cannot retrieve todos" });
  }
});

app.post("/todo", (req, res) => {
  const jsonData = readDataFile();
  var newTodo = {
    id: uuid.v4(),
    title: req.body.title,
    description: req.body.description,
  };
  jsonData.push(newTodo);

  writeDataFile(jsonData);
  console.log("NEW Todo added!");
  res.sendStatus(200);
});

app.delete("/todo", (req, res) => {
  const rawTitle = req.body.title;
  const title = rawTitle.trim();
  console.log(title);
  var todos = readDataFile();
  var todoIndex = todos.findIndex((t) => t.title === title);
  console.log(todoIndex);
  if (todoIndex === -1) {
    console.log(".....Dekhleeee bhai");
    res.status(404).send("Todo not Found!");
  } else {
    todos.splice(todoIndex, 1);
    writeDataFile(todos);
    res.sendStatus(200);
  }
});

app.listen(PORT, () => console.log(`Server listening at port: ${PORT}`));
