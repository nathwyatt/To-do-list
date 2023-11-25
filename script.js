document.addEventListener('DOMContentLoaded', function () {
    loadTasks();
});

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');

    if (taskInput.value.trim() !== '') {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${taskInput.value}</span>
            <div>
                <button class="delete" onclick="deleteTask(this)">Delete</button>
                <button class="important" onclick="toggleImportant(this)">Mark Important</button>
            </div>
        `;

        taskList.insertBefore(li, taskList.firstChild);
        saveTask(taskInput.value);
        taskInput.value = '';
    }
}

function deleteTask(button) {
    const li = button.parentNode.parentNode;
    const taskText = li.firstChild.textContent.trim();

    li.remove();
    removeTask(taskText);
}

function toggleImportant(button) {
    const li = button.parentNode.parentNode;
    li.classList.toggle('important');

    const taskText = li.firstChild.textContent.trim();
    updateTaskStatus(taskText, li.classList.contains('important'));
    reorderTasks();
}

function updateTaskStatus(task, isImportant) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const index = tasks.indexOf(task);

    if (index !== -1) {
        tasks.splice(index, 1);

        if (isImportant) {
            tasks.unshift(task);
        } else {
            tasks.push(task);
        }

        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

function removeTask(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(t => t !== task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskList = document.getElementById('taskList');

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${index + 1}. ${task}</span>
            <div>
                <button class="delete" onclick="deleteTask(this)">Delete</button>
                <button class="important" onclick="toggleImportant(this)">Mark Important</button>
            </div>
        `;
        taskList.appendChild(li);

        if (isTaskImportant(task)) {
            li.classList.add('important');
        }
    });
}

function isTaskImportant(task) {
    let importantTasks = JSON.parse(localStorage.getItem('importantTasks')) || [];
    return importantTasks.includes(task);
}

function toggleTask(event) {
    const clickedElement = event.target;

    if (clickedElement.tagName === 'SPAN') {
        const li = clickedElement.parentNode;
        li.classList.toggle('selected');

        const taskText = li.firstChild.textContent.trim();
        updateTaskStatus(taskText, li.classList.contains('selected'));
        reorderTasks();
    }
}

function reorderTasks() {
    const taskList = document.getElementById('taskList');
    const selectedTasks = document.querySelectorAll('.selected');
    const unselectedTasks = document.querySelectorAll('li:not(.selected)');

    taskList.innerHTML = '';

    selectedTasks.forEach(task => taskList.appendChild(task.cloneNode(true)));
    unselectedTasks.forEach(task => taskList.appendChild(task.cloneNode(true)));
}
