document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const addButton = document.getElementById('addButton');
    const taskList = document.getElementById('taskList');

    // 本地存储相关功能
    const STORAGE_KEY = 'todoItems';
    
    function saveTasks() {
        const tasks = Array.from(taskList.children).map(li => li.firstChild.textContent);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        tasks.forEach(task => createTaskElement(task));
    }

    // 创建任务元素
    function createTaskElement(taskText) {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.textContent = taskText;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '删除';
        deleteBtn.classList.add('delete-btn');
        
        li.append(span, deleteBtn);
        taskList.appendChild(li);
    }

    // 添加任务
    function addTask() {
        const taskText = taskInput.value.trim();
        if (!taskText) return;

        createTaskElement(taskText);
        taskInput.value = '';
        saveTasks();
    }

    // 事件委托处理删除操作
    taskList.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-btn')) {
            e.target.parentElement.remove();
            saveTasks();
        }
    });

    // 初始化
    loadTasks();
    
    // 事件监听
    addButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
});
