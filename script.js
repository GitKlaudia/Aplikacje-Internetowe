class ToDoList {
    constructor() {
        const savedTasks = localStorage.getItem('tasks');
        this.tasks = savedTasks ? JSON.parse(savedTasks) : [];
        this.term = '';
        this.draw(); 
    }

    draw() {
        const listElement = document.querySelector('ul');
        listElement.innerHTML = '';

        this.filteredTasks.forEach(task => {
            const index = this.tasks.indexOf(task);

            const li = document.createElement('li');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;

            let textHtml = task.text;
            if (this.term.length >= 2) {
                const regex = new RegExp(`(${this.term})`, 'gi');
                textHtml = task.text.replace(regex, '<mark>$1</mark>');
            }

            const span = document.createElement('span');
            span.innerHTML = textHtml;
            span.classList.add('task-text');
            span.addEventListener('click', () => this.editTask(index, span));

            const dateSpan = document.createElement('span');
            dateSpan.textContent = task.date || '';
            dateSpan.classList.add('task-date');
            dateSpan.addEventListener('click', () => this.editDate(index, dateSpan));

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '🗑️';
            deleteBtn.classList.add('delete');
            deleteBtn.addEventListener('click', () => this.deleteTask(index));

            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(dateSpan);
            li.appendChild(deleteBtn);

            listElement.appendChild(li);
        });
    }

    get filteredTasks() {
        if (this.term.length < 2) return this.tasks;
            return this.tasks.filter(task => task.text.toLowerCase().includes(this.term.toLowerCase()));
    }

    deleteTask(index) {
        this.tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(this.tasks)); 
        this.draw();
    }

    addTask(text, date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const chosenDate = new Date(date);


        if (chosenDate < today) {
            alert('Inavlid date');
            return;
        }

        if (text.length < 3 || text.length > 255) { 
            alert('Task must be 3–255 characters long');
            return;
        }

        this.tasks.push({ text: text, date: date });
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        this.draw();   
    }

    editDate(index, dateElement) {
        const oldDate = this.tasks[index].date;
        const input = document.createElement('input');
        input.type = 'date';
        input.value = oldDate;
        input.classList.add('edit-input');
        dateElement.replaceWith(input);
        input.focus();
        input.addEventListener('blur', () => this.saveDate(index, input.value));
    }

    editTask(index, spanElement) {
        const oldText = this.tasks[index].text;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = oldText;
        input.classList.add('edit-input');
        spanElement.replaceWith(input);
        input.focus();
        input.addEventListener('blur', () => this.saveEdit(index, input.value));
    }

    saveDate(index, newDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const chosenDate = new Date(newDate);


        if (chosenDate < today) {
            alert('Inavlid date');
            return;
        }

        this.tasks[index].date = newDate;
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        this.draw(); 
    }


    saveEdit(index, newText) {
        if (newText.trim().length < 3 || newText.trim().length > 255) {
            alert('Task must be 3–255 characters long.');
            this.draw();
            return;
        }

        this.tasks[index].text = newText.trim();
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        this.draw();
    }


}


const addButton = document.querySelector('.add-button');
const addInput = document.querySelector('.add-input');
const dateInput = document.querySelector('.date');

addButton.addEventListener('click', function() {
    const taskText = addInput.value;
    const taskDate = dateInput.value;

    if (taskText.trim() !== '') { 
        toDoList.addTask(taskText, taskDate); 
        addInput.value = ''; 
        dateInput.value = '';
    } else {
        alert('Please enter a task!');
    }
});

const searchInput = document.querySelector('.search-input');
searchInput.addEventListener('input', () => {
    toDoList.term = searchInput.value;
    toDoList.draw();
});



const toDoList = new ToDoList();

