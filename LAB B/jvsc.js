document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const addTaskBtn = document.getElementById('add-task-btn');
    const newTaskInput = document.getElementById('new-task');
    const taskDeadlineInput = document.getElementById('task-deadline');
    const searchInput = document.getElementById('search');

    // Load tasks from Local Storage on page load
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Helper function to format the date to "dd-MM-yyyy HH:mm"
    function formatDate(dateString) {
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

    // Function to render task list
    function renderTasks(filteredTasks = tasks) {
        taskList.innerHTML = '';
        filteredTasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.classList.add('task-item');

            const taskText = document.createElement('span');
            taskText.innerHTML = highlightSearchTerm(task.text, searchInput.value); // Highlight search term
            taskItem.appendChild(taskText);

            const taskDate = document.createElement('span');
            taskDate.classList.add('task-date');
            taskDate.textContent = formatDate(task.deadline);
            taskItem.appendChild(taskDate);

            // Add delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '🗑';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.addEventListener('click', () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });
            taskItem.appendChild(deleteBtn);

            // Task name edit functionality
            taskText.addEventListener('click', () => {
                const editInput = document.createElement('input');
                editInput.type = 'text';
                editInput.value = task.text;
                taskItem.replaceChild(editInput, taskText);
                editInput.focus();

                // Save changes on blur or Enter key
                editInput.addEventListener('blur', () => {
                    task.text = editInput.value;
                    saveTasks();
                    renderTasks();
                });
                editInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        task.text = editInput.value;
                        saveTasks();
                        renderTasks();
                    }
                });
            });

            // Task date edit functionality
            taskDate.addEventListener('click', () => {
                const dateInput = document.createElement('input');
                dateInput.type = 'datetime-local';
                dateInput.value = task.deadline || '';  // Set current date if available
                taskItem.replaceChild(dateInput, taskDate);
                dateInput.focus();

                // Save changes on blur or Enter key
                dateInput.addEventListener('blur', () => {
                    const newDate = dateInput.value;
                    if (!newDate || new Date(newDate) >= new Date()) { // Validate date
                        task.deadline = newDate || 'Brak terminu';
                        saveTasks();
                        renderTasks();
                    } else {
                        alert('Data musi być w przyszłości.');
                        renderTasks();
                    }
                });
                dateInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        const newDate = dateInput.value;
                        if (!newDate || new Date(newDate) >= new Date()) { // Validate date
                            task.deadline = newDate || 'Brak terminu';
                            saveTasks();
                            renderTasks();
                        } else {
                            alert('Data musi być w przyszłości.');
                            renderTasks();
                        }
                    }
                });
            });

            taskList.appendChild(taskItem);
        });
    }

    // Function to save tasks to Local Storage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Add new task
    addTaskBtn.addEventListener('click', () => {
        const taskText = newTaskInput.value.trim();
        const taskDeadline = taskDeadlineInput.value;

        // Validate task text
        if (taskText.length < 3 || taskText.length > 255) {
            alert('Zadanie musi mieć co najmniej 3 znaki i nie więcej niż 255 znaków.');
            return;
        }

        // Validate task deadline
        if (taskDeadline && new Date(taskDeadline) < new Date()) {
            alert('Data musi być w przyszłości.');
            return;
        }

        // Add task to the list
        tasks.push({ text: taskText, deadline: taskDeadline });
        saveTasks();
        renderTasks();

        // Clear input fields
        newTaskInput.value = '';
        taskDeadlineInput.value = '';
    });

    // Search functionality
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm.length >= 2) {
            const filteredTasks = tasks.filter(task => task.text.toLowerCase().includes(searchTerm));
            renderTasks(filteredTasks);
        } else {
            renderTasks();
        }
    });

    // Function to highlight search term
    function highlightSearchTerm(text, term) {
        if (!term || term.length < 2) return text; // Only highlight if term is 2+ characters
        const regex = new RegExp(`(${term})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // Load and display tasks on page load
    renderTasks();
});
