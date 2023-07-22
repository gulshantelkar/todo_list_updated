const taskInput = document.getElementById("taskInput");
const categoryInput = document.getElementById("categoryInput");
const priorityInput = document.getElementById("priorityInput");
const dueDateInput = document.getElementById("dueDateInput");
const reminderInput = document.getElementById("reminderInput");
const taskList = document.getElementById("taskList");
const filterCategory = document.getElementById("filterCategory");
const filterPriority = document.getElementById("filterPriority");
const filterDueDate = document.getElementById("filterDueDate");
const sortOption = document.getElementById("sortOption");
const searchInput = document.getElementById("searchInput");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function displayTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const listItem = document.createElement("li");
    listItem.setAttribute("draggable", "true");
    listItem.setAttribute("ondragstart", `dragTask(event, ${index})`);
    listItem.innerHTML = `
      <input type="checkbox" onchange="toggleTaskStatus(${index})" ${task.done ? "checked" : ""}>
      <strong>Task:</strong> ${task.taskName}<br>
      <strong>Category:</strong> ${task.category}<br>
      <strong>Priority:</strong> ${task.priority}<br>
      <strong>Due Date:</strong> ${task.dueDate}<br>
      <strong>Reminder:</strong> ${task.reminder ? task.reminder : "Not set"}<br>
      <button onclick="editTask(${index})">Edit</button>
      <button onclick="deleteTask(${index})">Delete</button>
    `;
    taskList.appendChild(listItem);
  });

  updateFilterDropdowns();
}

function addTask() {
  const newTask = taskInput.value.trim();
  if (newTask === "") return;

  const category = categoryInput.value.trim();
  const priority = priorityInput.value;
  const dueDate = dueDateInput.value;
  const reminder = reminderInput.value;

  const task = {
    taskName: newTask,
    category: category,
    priority: priority,
    dueDate: dueDate,
    reminder: reminder || null,
    done: false // New task is marked as not done
  };

  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  taskInput.value = "";
  categoryInput.value = "";
  priorityInput.value = "low";
  dueDateInput.value = "";
  reminderInput.value = "";

  displayTasks();
}

function editTask(index) {
  const task = tasks[index];
  const editedTask = prompt("Edit the task:", task.taskName);
  if (editedTask !== null) {
    task.taskName = editedTask.trim();
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();
  }
}

function deleteTask(index) {
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
}

function toggleTaskStatus(index) {
  tasks[index].done = !tasks[index].done;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
}

function updateFilterDropdowns() {
  // Get unique categories and populate the filterCategory dropdown
  const uniqueCategories = [...new Set(tasks.map((task) => task.category))];
  filterCategory.innerHTML = `
    <option value="all">All Categories</option>
    ${uniqueCategories
      .map((category) => `<option value="${category}">${category}</option>`)
      .join("")}
  `;

  // Get unique priorities and populate the filterPriority dropdown
  const uniquePriorities = [...new Set(tasks.map((task) => task.priority))];
  filterPriority.innerHTML = `
    <option value="all">All Priorities</option>
    ${uniquePriorities
      .map((priority) => `<option value="${priority}">${priority}</option>`)
      .join("")}
  `;
}

function filterTasks() {
  const selectedCategory = filterCategory.value;
  const selectedPriority = filterPriority.value;
  const selectedDueDate = filterDueDate.value;

  const filteredTasks = tasks.filter((task) => {
    const categoryMatch = selectedCategory === "all" || task.category === selectedCategory;
    const priorityMatch = selectedPriority === "all" || task.priority === selectedPriority;
    const dueDateMatch =
      selectedDueDate === "" || task.dueDate === "" || task.dueDate === selectedDueDate;

    return categoryMatch && priorityMatch && dueDateMatch;
  });

  displayFilteredTasks(filteredTasks);
}

function displayFilteredTasks(filteredTasks) {
  taskList.innerHTML = "";

  filteredTasks.forEach((task, index) => {
    const listItem = document.createElement("li");
    listItem.setAttribute("draggable", "true");
    listItem.setAttribute("ondragstart", `dragTask(event, ${index})`);
    listItem.innerHTML = `
      <input type="checkbox" onchange="toggleTaskStatus(${index})" ${task.done ? "checked" : ""}>
      <strong>Task:</strong> ${task.taskName}<br>
      <strong>Category:</strong> ${task.category}<br>
      <strong>Priority:</strong> ${task.priority}<br>
      <strong>Due Date:</strong> ${task.dueDate}<br>
      <strong>Reminder:</strong> ${task.reminder ? task.reminder : "Not set"}<br>
      <button onclick="editTask(${index})">Edit</button>
      <button onclick="deleteTask(${index})">Delete</button>
    `;
    taskList.appendChild(listItem);
  });
}

function clearFilters() {
  filterCategory.value = "all";
  filterPriority.value = "all";
  filterDueDate.value = "";
  displayTasks();
}

function sortTasks() {
  const sortBy = sortOption.value;
  if (sortBy === "priority") {
    tasks.sort((a, b) => {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  } else if (sortBy === "dueDate") {
    tasks.sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1));
  }
  
  displayTasks();
}

function searchTasks() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  if (searchTerm === "") return;
  
  const searchResults = tasks.filter(task => task.taskName.toLowerCase().includes(searchTerm));
  displayFilteredTasks(searchResults);
}

function clearSearch() {
  searchInput.value = "";
  displayTasks();
}

// Event listeners for the Sort and Search buttons
sortOption.addEventListener("change", sortTasks);
searchInput.addEventListener("input", searchTasks);

displayTasks();

// Drag and Drop functions
let dragTaskIndex = null;

function allowDropTask(event) {
  event.preventDefault();
}

function dragTask(event, index) {
  dragTaskIndex = index;
}

function dropTask(event) {
  event.preventDefault();
  const dropIndex = tasks.length; // Default to move the task to the end of the list

  if (dragTaskIndex !== null) {
    const [draggedTask] = tasks.splice(dragTaskIndex, 1);
    tasks.splice(dropIndex, 0, draggedTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();
    dragTaskIndex = null;
  }
}

function addSubtask() {
  const subtaskName = subtaskInput.value.trim();
  if (subtaskName === "") return;

  const activeTask = tasks.find((task) => task.active);

  if (activeTask) {
    if (!activeTask.subtasks) {
      activeTask.subtasks = [];
    }
    activeTask.subtasks.push({
      subtaskName,
      done: false
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));

    subtaskInput.value = "";

    displayTasks();
  }
}
