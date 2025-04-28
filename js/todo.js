
// Select elements
const todoInput = document.getElementById("todo-input");
const addTodoButton = document.getElementById("add-todo");
const todoList = document.getElementById("todo-list");

// Load TODOs from localStorage on page load
document.addEventListener("DOMContentLoaded", loadTodos);

// Function to add a TODO item
function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText === "") {
        alert("Please enter a valid TODO!");
        return;
    }

    const todo = { text: todoText, completed: false };
    saveTodoToLocalStorage(todo);
    renderTodo(todo);
    todoInput.value = "";
}

// Function to render a TODO item
function renderTodo(todo) {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";

    const textSpan = document.createElement("span");
    textSpan.textContent = todo.text;
    textSpan.classList.add("flex-grow-1");
    if (todo.completed) {
        textSpan.classList.add("completed");
    }

    textSpan.addEventListener("click", () => {
        textSpan.classList.toggle("completed");
        updateCompletionInLocalStorage(todo.text);
    });

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "btn btn-sm btn-outline-secondary";
    editButton.addEventListener("click", () => editTodo(todo.text, li));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "btn btn-sm btn-outline-danger";
    deleteButton.addEventListener("click", () => deleteTodo(todo.text, li));

    const btnGroup = document.createElement("div");
    btnGroup.appendChild(editButton);
    btnGroup.appendChild(deleteButton);

    li.appendChild(textSpan);
    li.appendChild(btnGroup);
    todoList.appendChild(li);
}

// Function to edit a TODO
function editTodo(oldText, li) {
    const newText = prompt("Edit your TODO:", oldText);
    if (newText && newText.trim() !== "") {
        li.firstChild.textContent = newText;
        updateTodoInLocalStorage(oldText, newText);
    }
}

// Function to delete a TODO
function deleteTodo(todoText, li) {
    li.remove();
    removeTodoFromLocalStorage(todoText);
}

// Clear all TODOs
function clearTodos() {
    if (confirm("Are you sure you want to delete all tasks?")) {
      localStorage.removeItem("todos");
      todoList.innerHTML = "";
    }
  }
  
  // Event listener for Clear button
  const clearButton = document.getElementById("clear-todos");
  if (clearButton) {
    clearButton.addEventListener("click", clearTodos);
  }

// Function to toggle TODO completion and update localStorage
function toggleComplete(event) {
    if (event.target.tagName !== "BUTTON") {
        event.currentTarget.classList.toggle("completed");
        updateCompletionInLocalStorage(event.currentTarget.firstChild.textContent);
    }
}

// Save TODO to localStorage
function saveTodoToLocalStorage(todo) {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Load TODOs from localStorage
function loadTodos() {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos.forEach(renderTodo);
}

// Update completion state in localStorage
function updateCompletionInLocalStorage(todoText) {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos = todos.map(todo => {
        if (todo.text === todoText) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Update edited TODO in localStorage
function updateTodoInLocalStorage(oldText, newText) {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos = todos.map(todo => {
        if (todo.text === oldText) {
            return { ...todo, text: newText };
        }
        return todo;
    });
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Remove TODO from localStorage
function removeTodoFromLocalStorage(todoText) {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos = todos.filter(todo => todo.text !== todoText);
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Event listeners
addTodoButton.addEventListener("click", addTodo);
todoInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addTodo();
    }
});
