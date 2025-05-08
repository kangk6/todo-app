document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const addButton = document.getElementById('addButton');
    const taskList = document.getElementById('taskList');

    // 添加待办事项
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        const li = document.createElement('li');
        li.innerHTML = `<span>${taskText}</span><button onclick="deleteTask(this)">删除</button>`;
        taskList.appendChild(li);

        taskInput.value = '';
    }

    // 删除待办事项
    function deleteTask(button) {
        const li = button.parentNode;
        taskList.removeChild(li);
    }

    addButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});