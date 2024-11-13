class Todo {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.taskList = document.getElementById('task-list');
        this.addTaskBtn = document.getElementById('add-task-btn');
        this.newTaskInput = document.getElementById('new-task');
        this.taskDeadlineInput = document.getElementById('task-deadline');
        this.searchInput = document.getElementById('search');

        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.searchInput.addEventListener('input', () => this.searchTasks());

        this.draw();
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    formatDate(dateString) {
        if (!dateString) return 'Brak terminu';
        const date = new Date(dateString);
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        };
        return date.toLocaleDateString('pl-PL', options).replace(',', ' ');
    }

    highlightSearchTerm(text, term) {
        if (!term || term.length < 2) return text;
        const regex = new RegExp(`(${term})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    draw(filteredTasks = this.tasks) {
        this.taskList.innerHTML = '';
        filteredTasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.classList.add('task-item');

            const taskText = document.createElement('span');
            taskText.innerHTML = this.highlightSearchTerm(task.text, this.searchInput.value);
            taskItem.appendChild(taskText);

            const taskDate = document.createElement('span');
            taskDate.classList.add('task-date');
            taskDate.textContent = this.formatDate(task.deadline);
            taskItem.appendChild(taskDate);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '🗑';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.addEventListener('click', () => {
                this.tasks.splice(index, 1);
                this.saveTasks();
                this.draw();
            });
            taskItem.appendChild(deleteBtn);

            taskText.addEventListener('click', () => this.editTaskText(task, taskText, taskItem));
            taskDate.addEventListener('click', () => this.editTaskDate(task, taskDate, taskItem));

            this.taskList.appendChild(taskItem);
        });
    }

    addTask() {
        const taskText = this.newTaskInput.value.trim();
        const taskDeadline = this.taskDeadlineInput.value;

        if (taskText.length < 3 || taskText.length > 255) {
            alert('Zadanie musi mieć co najmniej 3 znaki i nie więcej niż 255 znaków.');
            return;
        }

        if (taskDeadline && new Date(taskDeadline) < new Date()) {
            alert('Data musi być w przyszłości.');
            return;
        }

        this.tasks.push({ text: taskText, deadline: taskDeadline });
        this.saveTasks();
        this.draw();

        this.newTaskInput.value = '';
        this.taskDeadlineInput.value = '';
    }

    searchTasks() {
        const searchTerm = this.searchInput.value.toLowerCase();
        if (searchTerm.length >= 2) {
            const filteredTasks = this.tasks.filter(task => task.text.toLowerCase().includes(searchTerm));
            this.draw(filteredTasks);
        } else {
            this.draw();
        }
    }

    editTaskText(task, taskText, taskItem) {
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = task.text;
        taskItem.replaceChild(editInput, taskText);
        editInput.focus();

        const saveChanges = () => {
            task.text = editInput.value;
            this.saveTasks();
            this.draw();
        };

        editInput.addEventListener('blur', saveChanges);
        editInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                saveChanges();
            }
        });
    }

    editTaskDate(task, taskDate, taskItem) {
        const dateInput = document.createElement('input');
        dateInput.type = 'datetime-local';
        dateInput.value = task.deadline || '';
        taskItem.replaceChild(dateInput, taskDate);
        dateInput.focus();

        const saveChanges = () => {
            const newDate = dateInput.value;
            if (!newDate || new Date(newDate) >= new Date()) {
                task.deadline = newDate || 'Brak terminu';
                this.saveTasks();
                this.draw();
            } else {
                alert('Data musi być w przyszłości.');
                this.draw();
            }
        };

        dateInput.addEventListener('blur', saveChanges);
        dateInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                saveChanges();
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Todo();
});