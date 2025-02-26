class TodoApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.filter = 'all';
        this.theme = localStorage.getItem('theme') || 'default';
        
        this.taskList = document.getElementById('taskList');
        this.taskInput = document.getElementById('taskInput');
        this.categorySelect = document.getElementById('categorySelect');
        this.prioritySelect = document.getElementById('prioritySelect');
        this.dueDate = document.getElementById('dueDate');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.clearCompletedBtn = document.getElementById('clearCompleted');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.themeButtons = document.querySelectorAll('.theme-btn');
        this.modal = document.getElementById('confirmationModal');
        this.confirmationText = document.getElementById('confirmationText');
        this.confirmClear = document.getElementById('confirmClear');
        this.cancelClear = document.getElementById('cancelClear');
        this.container = document.querySelector('.container');

        this.init();
    }

    init() {
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        this.clearCompletedBtn.addEventListener('click', () => this.showClearConfirmation());
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => this.setFilter(btn.dataset.filter));
        });
        this.themeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.setTheme(btn.dataset.theme));
        });
        this.confirmClear.addEventListener('click', () => this.handleConfirmClear());
        this.cancelClear.addEventListener('click', () => this.hideModal());

        this.applyTheme();
        this.renderTasks();
    }

    addTask() {
        const text = this.taskInput.value.trim();
        if (!text) return;

        const task = {
            id: Date.now(),
            text,
            category: this.categorySelect.value,
            priority: this.prioritySelect.value,
            dueDate: this.dueDate.value,
            completed: false
        };

        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
        this.taskInput.value = '';
        this.dueDate.value = '';
    }

    toggleTask(id) {
        this.tasks = this.tasks.map(task => {
            if (task.id === id) {
                task.completed = !task.completed;
            }
            return task;
        });
        this.saveTasks();
        this.renderTasks();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.renderTasks();
    }

    showClearConfirmation() {
        const completedCount = this.tasks.filter(task => task.completed).length;
        if (completedCount === 0) {
            this.confirmationText.textContent = 'No completed tasks to clear!';
            this.confirmClear.style.display = 'none';
            this.modal.style.display = 'flex';
            return;
        }
        
        this.confirmationText.textContent = `Are you sure you want to clear ${completedCount} completed task${completedCount > 1 ? 's' : ''}? This action cannot be undone.`;
        this.confirmClear.style.display = 'inline-block';
        this.modal.style.display = 'flex';
    }

    handleConfirmClear() {
        this.clearCompleted();
        this.hideModal();
    }

    clearCompleted() {
        this.tasks = this.tasks.filter(task => !task.completed);
        this.saveTasks();
        this.renderTasks();
    }

    hideModal() {
        this.modal.style.display = 'none';
    }

    setFilter(filter) {
        this.filter = filter;
        this.filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.renderTasks();
    }

    setTheme(theme) {
        this.theme = theme;
        localStorage.setItem('theme', theme);
        this.applyTheme();
    }

    applyTheme() {
        document.body.className = this.theme;
        this.container.className = `container ${this.theme}`;
        this.themeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === this.theme);
        });
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    renderTasks() {
        this.taskList.innerHTML = '';
        const filteredTasks = this.tasks.filter(task => {
            if (this.filter === 'active') return !task.completed;
            if (this.filter === 'completed') return task.completed;
            return true;
        });

        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span>${task.text}</span>
                <div class="task-meta">
                    <span class="priority ${task.priority}">${task.priority}</span>
                    <span class="category">${task.category}</span>
                    ${task.dueDate ? `<span class="due-date">Due: ${new Date(task.dueDate).toLocaleDateString()}</span>` : ''}
                </div>
                <button class="delete-btn"><i class="material-icons">delete</i></button>
            `;

            li.querySelector('input[type="checkbox"]').addEventListener('change', () => this.toggleTask(task.id));
            li.querySelector('.delete-btn').addEventListener('click', () => this.deleteTask(task.id));
            
            this.taskList.appendChild(li);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new TodoApp());