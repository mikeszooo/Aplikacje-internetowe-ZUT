document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const addTaskBtn = document.getElementById('add-task-btn');
    const newTaskInput = document.getElementById('new-task');
    const taskDeadlineInput = document.getElementById('task-deadline');
    const searchInput = document.getElementById('search');

    // Załaduj zadania z Local Storage przy starcie strony
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Funkcja do renderowania listy zadań
    function renderTasks(filteredTasks = tasks) {
        taskList.innerHTML = '';
        filteredTasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.classList.add('task-item');

            const taskText = document.createElement('span');
            taskText.innerHTML = highlightSearchTerm(task.text, searchInput.value); // Wyróżnienie wyszukiwanego terminu
            taskItem.appendChild(taskText);

            const taskDate = document.createElement('span');
            taskDate.classList.add('task-date');
            taskDate.textContent = task.deadline || 'Brak terminu';
            taskItem.appendChild(taskDate);

            // Przycisk usuwania
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '🗑';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.addEventListener('click', () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });
            taskItem.appendChild(deleteBtn);

            // Kliknięcie w pozycję na liście do edycji
            taskText.addEventListener('click', () => {
                const editInput = document.createElement('input');
                editInput.type = 'text';
                editInput.value = task.text;
                taskItem.replaceChild(editInput, taskText);
                editInput.focus();

                // Zapisanie zmian po kliknięciu poza pole edycji
                editInput.addEventListener('blur', () => {
                    task.text = editInput.value;
                    saveTasks();
                    renderTasks();
                });
            });

            taskList.appendChild(taskItem);
        });
    }

    // Funkcja do zapisu zadań do Local Storage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Dodanie nowego zadania
    addTaskBtn.addEventListener('click', () => {
        const taskText = newTaskInput.value.trim();
        const taskDeadline = taskDeadlineInput.value;

        // Walidacja tekstu zadania
        if (taskText.length < 3 || taskText.length > 255) {
            alert('Zadanie musi mieć co najmniej 3 znaki i nie więcej niż 255 znaków.');
            return;
        }

        // Walidacja terminu zadania
        if (taskDeadline && new Date(taskDeadline) < new Date()) {
            alert('Data musi być w przyszłości.');
            return;
        }

        // Dodajemy zadanie do listy
        tasks.push({ text: taskText, deadline: taskDeadline });
        saveTasks();
        renderTasks();

        // Wyczyszczenie pól
        newTaskInput.value = '';
        taskDeadlineInput.value = '';
    });

    // Wyszukiwanie
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm.length >= 2) {
            const filteredTasks = tasks.filter(task => task.text.toLowerCase().includes(searchTerm));
            renderTasks(filteredTasks);
        } else {
            renderTasks();
        }
    });

    // Funkcja wyróżniania wyszukiwanego terminu
    function highlightSearchTerm(text, term) {
        if (!term) return text;
        const regex = new RegExp(`(${term})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // Załaduj i wyświetl zadania przy starcie
    renderTasks();
});