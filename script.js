document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        taskInput: document.getElementById('taskInput'),
        addButton: document.getElementById('addButton'),
        taskList: document.getElementById('taskList'),
        filterSelect: document.getElementById('filterSelect'),
        taskCount: document.getElementById('taskCount'),
        progressBar: document.getElementById('progressBar'),
        themeToggle: document.getElementById('themeToggle')
    };

    // 状态管理
    let currentTasks = [];
    const STORAGE_KEY = 'smartTodos';
    const PRIORITY_ICONS = { high: '🔼', medium: '⏺', low: '🔽' };

    // 初始化
    initApp();

    function initApp() {
        loadTasks();
        setupEventListeners();
        updateStats();
    }

    // 事件监听
    function setupEventListeners() {
        elements.addButton.addEventListener('click', addTask);
        elements.taskInput.addEventListener('keypress', e => e.key === 'Enter' && addTask());
        elements.taskList.addEventListener('click', handleTaskActions);
        elements.filterSelect.addEventListener('change', filterTasks);
        elements.themeToggle.addEventListener('click', toggleTheme);
        
        document.querySelectorAll('.tag-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                elements.taskInput.value += ` ${btn.dataset.tag}`;
                elements.taskInput.focus();
            });
        });
    }

    // 任务数据结构
    function createTaskObject(text) {
        return {
            id: Date.now(),
            text: text.replace(/(#\w+)|([🔼⏺🔽])/g, '').trim(),
            completed: false,
            tags: extractTags(text),
            priority: detectPriority(text),
            createdAt: new Date().toISOString()
        };
    }

    // 智能解析
    function extractTags(text) {
        return [...text.matchAll(/#(\w+)/g)].map(match => match[1]);
    }

    function detectPriority(text) {
        if (text.includes('🔼')) return 'high';
        if (text.includes('⏺')) return 'medium';
        if (text.includes('🔽')) return 'low';
        return 'medium';
    }

    // 任务操作
    function addTask() {
        const taskText = elements.taskInput.value.trim();
        if (!taskText) return showToast('请输入有效任务');

        const newTask = createTaskObject(taskText);
        currentTasks.push(newTask);
        renderTask(newTask);
        saveState();
        elements.taskInput.value = '';
        showToast('任务添加成功', 'success');
    }

    function toggleTask(taskId) {
        currentTasks = currentTasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        saveState();
        updateStats();
    }

    // 渲染优化
    function renderTask(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.tags = task.tags.join(' ');
        li.innerHTML = `
            <div class="task-content">
                <input type="checkbox" ${task.completed ? 'checked' : ''} 
                       aria-label="标记任务为${task.completed ? '未完成' : '已完成'}">
                <span>${PRIORITY_ICONS[task.priority]} ${task.text}</span>
                <div class="tags">${task.tags.map(t => `<span class="tag">#${t}</span>`).join('')}</div>
            </div>
            <div class="task-actions">
                <button class="delete-btn" aria-label="删除任务">🗑️</button>
            </div>
        `;
        elements.taskList.appendChild(li);
    }

    // 状态管理
    function saveState() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentTasks));
        filterTasks();
        updateStats();
    }

    function loadTasks() {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        currentTasks = saved;
        elements.taskList.innerHTML = '';
        currentTasks.forEach(renderTask);
    }

    // 其他功能
    function filterTasks() {
        const filter = elements.filterSelect.value;
        document.querySelectorAll('.task-item').forEach(item => {
            item.style.display = filter === 'all' || item.dataset.tags.includes(filter) ? '' : 'none';
        });
    }

    function updateStats() {
        const total = currentTasks.length;
        const completed = currentTasks.filter(t => t.completed).length;
        elements.taskCount.textContent = `完成任务：${completed}/${total}`;
        elements.progressBar.value = total ? (completed / total) * 100 : 0;
    }

    function toggleTheme() {
        document.documentElement.setAttribute('data-theme',
            document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
        );
    }

    // 事件处理
    function handleTaskActions(e) {
        const taskItem = e.target.closest('.task-item');
        if (!taskItem) return;

        if (e.target.matches('input[type="checkbox"]')) {
            toggleTask(parseInt(taskItem.dataset.id));
        }

        if (e.target.matches('.delete-btn')) {
            currentTasks = currentTasks.filter(t => t.id !== parseInt(taskItem.dataset.id));
            taskItem.remove();
            saveState();
            showToast('任务已删除', 'warning');
        }
    }

    // 用户反馈
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.remove(), 3000);
    }
});
