
const todoTasks = document.getElementById("todo-tasks");
const doingTasks = document.getElementById("doing-tasks");
const doneTasks = document.getElementById("done-tasks");

const taskModal = document.getElementById("task-modal");
const taskTitle = document.getElementById("task-title");
const taskDescription = document.getElementById("task-description");
const saveButton = document.getElementById("save-button");

const addTaskModal = document.getElementById("add-task-modal");
const newTaskTitle = document.getElementById("new-task-title");
const newTaskDescription = document.getElementById("new-task-description");

let tasks = [];

let isEditing = false;
let editedTaskIndex = -1; 

function showTaskModal(title, description) {
    taskTitle.innerText = title;
    taskDescription.innerText = description;
    taskModal.style.display = "block";

    if (!isEditing) {
        taskTitle.contentEditable = false;
        taskDescription.contentEditable = false;
        saveButton.style.display = "none";
    } else {
        taskTitle.contentEditable = true;
        taskDescription.contentEditable = true;
        saveButton.style.display = "block";
        taskTitle.focus();
    }
}

function closeTaskModal() {
    taskModal.style.display = "none";
    taskTitle.contentEditable = false;
    taskDescription.contentEditable = false;
    saveButton.style.display = "none";
}

function showAddTaskModal() {
    addTaskModal.style.display = "block";
}

function closeAddTaskModal() {
    addTaskModal.style.display = "none";
    newTaskTitle.value = "";
    newTaskDescription.value = "";
}

function addTask() {
    const title = newTaskTitle.value;
    const description = newTaskDescription.value;
    if (title) {
        tasks.push({ title, description, status: "todo" });
        renderTasks();
        closeAddTaskModal();
    }
}

function editTask() {
    if (!isEditing) {
        isEditing = true;
        editedTaskIndex = tasks.findIndex(task => task.title === taskTitle.innerText);
        showTaskModal(taskTitle.innerText, taskDescription.innerText);
    } else {
        isEditing = false;
        editedTaskIndex = -1;
        showTaskModal(taskTitle.innerText, taskDescription.innerText);
    }
}

function saveTask() {
    const editedTitle = taskTitle.innerText;
    const editedDescription = taskDescription.innerText;

    if (editedTaskIndex !== -1) {
        tasks[editedTaskIndex].title = editedTitle;
        tasks[editedTaskIndex].description = editedDescription;

    
        const taskCard = document.querySelector(`.task-card[data-title="${editedTitle}"]`);
        if (taskCard) {
            taskCard.innerText = editedTitle;
        }

        renderTasks();
    }

    isEditing = false;
    editedTaskIndex = -1;
    closeTaskModal();
}

function removeTask() {
    const title = taskTitle.innerText;
    const index = tasks.findIndex(task => task.title === title);
    if (index !== -1) {
        if (confirm("Are you sure you want to remove this task?")) {
            tasks.splice(index, 1);
            renderTasks();
            closeTaskModal();
        }
    }
}



function renderTasks() {
    todoTasks.innerHTML = "";
    doingTasks.innerHTML = "";
    doneTasks.innerHTML = "";

    tasks.forEach((task, index) => {
        const taskCard = document.createElement("div");
        taskCard.classList.add("task-card");
        taskCard.innerText = task.title;
        taskCard.draggable = true;
        taskCard.setAttribute("data-title", task.title); 
        taskCard.setAttribute("ondragstart", "drag(event)");

        taskCard.addEventListener("click", () => {
            showTaskModal(task.title, task.description);
        });

        switch (task.status) {
            case "todo":
                todoTasks.appendChild(taskCard);
                break;
            case "doing":
                doingTasks.appendChild(taskCard);
                break;
            case "done":
                doneTasks.appendChild(taskCard);
                break;
            default:
                break;
        }
    });
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.innerText);
}

function drop(event, status) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const index = tasks.findIndex(task => task.title === data);
    if (index !== -1) {
        tasks[index].status = status;
        renderTasks();
    }
}

renderTasks();





