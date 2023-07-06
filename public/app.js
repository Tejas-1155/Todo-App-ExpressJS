// Selectors
const todoTitle = document.getElementById("input-title");
const todoDesc = document.getElementById("input-desc");
const submitBtn = document.querySelector(".submit-btn");
const todoList = document.querySelector(".todo-list");
const completedBtn = document.querySelector(".completed-btn");
const trashBtn = document.querySelector(".trash-btn");

// Event Listeners
submitBtn.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);

// Variables
var titleToDelete = [];

// Server Methods
function getTodos() {
  fetch("http://localhost:3000/todos")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((todo) => {
        displayTodo(todo.title, todo.description);
      });
    })
    .catch((error) => {
      console.error("Error fetching todos:", error);
    });
}

function onSubmit() {
  fetch("http://localhost:3000/todo", {
    method: "POST",
    body: JSON.stringify({
      title: todoTitle.value,
      description: todoDesc.value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function onDelete(deleteTitle) {
  fetch("http://localhost:3000/todo", {
    method: "DELETE",
    body: JSON.stringify({
      title: deleteTitle,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// Functions
function addTodo() {
  if (todoTitle.value === "" || todoDesc.value === "") {
    alert("EMPTY FIELDS");
  } else {
    // Submit to POST method
    onSubmit();
    displayTodo(todoTitle.value, todoDesc.value);
    todoTitle.value = "";
    todoDesc.value = "";
  }
}

function displayTodo(title, description) {
  // Todo div
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");

  // Create li elements
  const newTodo = document.createElement("li");
  newTodo.innerHTML = `
  <li id = "newTodo-title" class = "newTodo"><b>${title}</b>
  <li id = "newTodo-desc" class = "newTodo">${description}
  `;
  newTodo.classList.add("todo-item");
  todoDiv.appendChild(newTodo);

  // Check Mark button
  const completedBtn = document.createElement("button");
  completedBtn.innerHTML = `<i class = "fas fa-check"></i>`;
  completedBtn.classList.add("completed-btn");
  completedBtn.classList.add("complete-trash-btn");
  todoDiv.appendChild(completedBtn);

  // Check Trash button
  const trashBtn = document.createElement("button");
  trashBtn.innerHTML = `<i class = "fas fa-trash"></i>`;
  trashBtn.classList.add("trash-btn");
  trashBtn.classList.add("complete-trash-btn");
  todoDiv.appendChild(trashBtn);

  // Appending todoDiv to the main todo-list
  todoList.appendChild(todoDiv);
  todoTitle.value = "";
  todoDesc.value = "";
}

function deleteCheck(e) {
  const item = e.target;
  var title =
    item.parentElement.firstElementChild.querySelector(
      "#newTodo-title"
    ).textContent;
  titleToDelete.push(title);

  if (item.classList[0] === "completed-btn") {
    const todo = item.parentElement;
    todo.classList.toggle("completed");
  }
  if (item.classList[0] === "trash-btn") {
    const todo = item.parentElement;
    todo.remove();
    onDelete(titleToDelete[0]);
    titleToDelete = [];
  }
}

getTodos();
