const taskInput = document.getElementById('task');
const taskList = document.getElementById('task-list');
const addTaskButton = document.getElementById('add-task');
const filterButtons = document.querySelectorAll('.filter-button');
const clearCompletedButton = document.getElementById('clear-completed');
const remainingTasksCount = document.getElementById('remaining-count');

let tasks = [];

// Event Listeners
addTaskButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

filterButtons.forEach((button) => {
    button.addEventListener('click', filterTasks);
});

clearCompletedButton.addEventListener('click', clearCompletedTasks);

// Functions
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false,
    };

    tasks.push(task);

    renderTask(task);
    updateLocalStorage();

    taskInput.value = '';
}

function renderTask(task) {
    const taskItem = document.createElement('li');
    taskItem.innerHTML = `
        <input type="checkbox" ${task.completed ? 'checked' : ''}>
        <span class="task-text">${task.text}</span>
        <button class="delete">Delete</button>
    `;

    taskList.appendChild(taskItem);

    const deleteButton = taskItem.querySelector('.delete');
    deleteButton.addEventListener('click', function () {
        taskItem.remove();
        deleteTask(task.id);
    });

    const checkbox = taskItem.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', function () {
        task.completed = !task.completed;
        updateLocalStorage();
        updateRemainingTasksCount();
        taskItem.classList.toggle('completed');
    });

    // Enable task editing
    const taskTextElement = taskItem.querySelector('.task-text');
    taskTextElement.addEventListener('click', function () {
        const newText = prompt('Edit Task:', task.text);
        if (newText !== null && newText.trim() !== '') {
            task.text = newText.trim();
            taskTextElement.textContent = newText.trim();
            updateLocalStorage();
        }
    });

    updateRemainingTasksCount();
}

function updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    updateLocalStorage();
    updateRemainingTasksCount();
}

function filterTasks(event) {
    const filterType = event.target.getAttribute('data-filter');

    filterButtons.forEach((button) => {
        button.classList.remove('active');
    });

    event.target.classList.add('active');

    const taskItems = document.querySelectorAll('li');

    if (filterType === 'active') {
        taskItems.forEach((taskItem) => {
            if (taskItem.classList.contains('completed')) {
                taskItem.style.display = 'none';
            } else {
                taskItem.style.display = 'flex';
            }
        });
    } else if (filterType === 'completed') {
        taskItems.forEach((taskItem) => {
            if (!taskItem.classList.contains('completed')) {
                taskItem.style.display = 'none';
            } else {
                taskItem.style.display = 'flex';
            }
        });
    } else {
        taskItems.forEach((taskItem) => {
            taskItem.style.display = 'flex';
        });
    }
}

function clearCompletedTasks() {
    tasks = tasks.filter((task) => !task.completed);

    const taskItems = document.querySelectorAll('li');
    taskItems.forEach((taskItem) => {
        if (taskItem.classList.contains('completed')) {
            taskItem.remove();
        }
    });

    updateLocalStorage();
    updateRemainingTasksCount();
}

function updateRemainingTasksCount() {
    const remaining = tasks.filter((task) => !task.completed).length;
    remainingTasksCount.textContent = `${remaining} ${remaining === 1 ? 'task' : 'tasks'} remaining`;
}

// Load tasks from local storage on page load
document.addEventListener('DOMContentLoaded', function () {
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach((task) => {
        renderTask(task);
    });

    const activeFilterButton = document.querySelector('[data-filter="all"]');
    activeFilterButton.classList.add('active');
    updateRemainingTasksCount();
});