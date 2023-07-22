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
    listItem.classList.add(`task-item-${index}`);
    listItem.classList.add(`taskItem`);
    let subtaskItem = ""
    console.log(`task ${index}`,task.subtask);
    if(task.subtask){
      subtaskItem+=`<ul class="subTaskList">`
      task.subtask.forEach((subtask,subIndex)=>{
        console.log(`task ${index} subtask ${subIndex} = ${subtask}`);
        subtaskItem += `<li class="subTaskItem" subtask="${subIndex}">
        <p>${subIndex+1}. ${subtask}</p>
        <input type="text" class="hidden editSubtask" name="editSubtask">
        <button btn="editSubtask" onclick="editSubtask(${index}, ${subIndex})">Edit</button>
        <button btn="saveSubtask" class="hidden" onclick="saveSubtask(${index}, ${subIndex})">Save</button>
        <button btn="deleteSubtask" onclick="deleteSubTask(${index},${ subIndex})">Delete</button>
        </li>` 
      })
      subtaskItem+=`</ul>`
    }
    listItem.innerHTML = `
      <div><input type="checkbox" onchange="toggleTaskStatus(${index})" ${task.done ? "checked" : ""}></div>
      <div>
      <p><strong>Task:</strong> ${task.taskName}</p>
      ${
       subtaskItem
      }
      <p><strong>Category:</strong> ${task.category}</p>
      <p><strong>Priority:</strong> ${task.priority}</p>
      <p><strong>Due Date:</strong> ${task.dueDate}</p>
      <p><strong>Reminder:</strong> ${task.reminder ? task.reminder : "Not set"}</p>
      <button onclick="editTask(${index})">Edit</button>
      <button onclick="deleteTask(${index})">Delete</button>
      <button onclick="toggleSubAddTaskSection(${index})">Add Subtask</button>
      <div class="addSubtaskSection">
        <input type="text" class="addsubtaskbtn" name="addSubtask">
        <button onclick="addSubtask(${index})">Add</button>
        <button onclick="toggleSubAddTaskSection(${index})">Cancel</button>
      </div>
      </div>
    `;

    taskList.appendChild(listItem);
  });

  updateFilterDropdowns();
}
function toggleSubAddTaskSection(index){
  const subTaskSection=document.querySelector(`.task-item-${index} div.addSubtaskSection`);
  if(subTaskSection.style.display=="block"){
    subTaskSection.style.display="none";
  }else{
    subTaskSection.style.display="block";
  }
}

function editSubtask(index, subIndex){
  console.log('edit subtask ', index, subIndex);
  const subTaskItem = document.querySelector(`.task-item-${index} .subTaskList li[subtask="${subIndex}"]`);
  const editButton = subTaskItem.querySelector(`button[btn="editSubtask"]`);
  const saveButton = subTaskItem.querySelector(`button[btn="saveSubtask"]`);
  const deleteButton = subTaskItem.querySelector(`button[btn="deleteSubtask"]`);
  const pTag = subTaskItem.querySelector(`p`);
  const subtaskInput = subTaskItem.querySelector(`input[name="editSubtask"]`);

  editButton.style.display = "none";
  deleteButton.style.display = "none";
  pTag.style.display = "none";

  saveButton.style.display = "block";
  subtaskInput.style.display = "block";
  const subTaskValue = pTag.innerText ?? "";
  subtaskInput.value = subTaskValue;
}

function saveSubtask(index, subIndex){
  const subTaskItem = document.querySelector(`.task-item-${index} .subTaskList li[subtask="${subIndex}"]`);
  const editButton = subTaskItem.querySelector(`button[btn="editSubtask"]`);
  const saveButton = subTaskItem.querySelector(`button[btn="saveSubtask"]`);
  const deleteButton = subTaskItem.querySelector(`button[btn="deleteSubtask"]`);
  const pTag = subTaskItem.querySelector(`p`);
  const subtaskInput = subTaskItem.querySelector(`input`);

  editButton.style.display = "block";
  deleteButton.style.display = "block";
  pTag.style.display = "block";

  saveButton.style.display = "none";
  subtaskInput.style.dislay = "none";

  const updatedValue = subtaskInput.value;
  
  tasks[index].subtask[subIndex] = updatedValue;
  localStorage.setItem("tasks", JSON.stringify(tasks));

  subtaskInput.value = "";
  displayTasks();
}

function addSubtask(index){
  const subTaskInputField=document.querySelector(`.task-item-${index} div.addSubtaskSection input[name="addSubtask"]`);
  const subtaskValue = subTaskInputField.value;
  if(tasks[index].subtask){
    tasks[index].subtask.push(subtaskValue);
  }else{
    tasks[index].subtask = [subtaskValue];
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));
  
  subtaskValue.value = "";

  displayTasks();
}

function deleteSubTask(index, subIndex){
  tasks[index].subtask.splice(subIndex,1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
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
    done: false, 
    subtask: []
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
  
  const uniqueCategories = [...new Set(tasks.map((task) => task.category))];
  filterCategory.innerHTML = `
    <option value="all">All Categories</option>
    ${uniqueCategories
      .map((category) => `<option value="${category}">${category}</option>`)
      .join("")}
  `;

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
  else if (sortBy === "pending") {
    viewPendingTasks();
  } else if (sortBy === "missed") {
    viewMissedTasks();
  } else {
    displayTasks();
  }

  displayTasks();
}
function clearSortFilter() {
  sortOption.value = "default";
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


sortOption.addEventListener("change", sortTasks);

searchInput.addEventListener("input", searchTasks);

displayTasks();

let dragTaskIndex = null;

function allowDropTask(event) {
  event.preventDefault();
}

function dragTask(event, index) {
  dragTaskIndex = index;
}

function dropTask(event) {
  event.preventDefault();
  const dropIndex = tasks.length; 

  if (dragTaskIndex !== null) {
    const [draggedTask] = tasks.splice(dragTaskIndex, 1);
    tasks.splice(dropIndex, 0, draggedTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();
    dragTaskIndex = null;
  }
}

function displayPendingTasks() {
  const pendingTasks = tasks.filter((task) => !task.done);
  displayFilteredTasks(pendingTasks);
}

function displayMissedTasks() {
  const today = new Date().toISOString().split("T")[0];
  const missedTasks = tasks.filter((task) => task.dueDate < today && !task.done);
  displayFilteredTasks(missedTasks);
}
function viewPendingTasks() {
  sortOption.value = "default";
  displayPendingTasks();
}

function viewMissedTasks() {
  sortOption.value = "default";
  displayMissedTasks();
}