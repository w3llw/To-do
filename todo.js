const form = document.querySelector("#todoForm");
const todoList = document.querySelector("#todoList");
const noTodoMessage = document.querySelector("#noTodoMessage");

const todos = [];

// Получаем сохраненные задачи из localStorage
const saveTodos = localStorage.getItem("todos");
if (saveTodos) {

    const todosFormLS = JSON.parse(saveTodos);
    todos.push(...todosFormLS);

    // Рендерим все задачи из localStorage
    todosFormLS.forEach((todo) => {
        renderTodo(todo);
    });
}

form.addEventListener("submit", addTodo);

function addTodo(evt) {
    evt.preventDefault();

    const todoInput = document.querySelector("#todoInput");

    if (todoInput.value.trim() === "") {
        todoInput.value = "";
        todoInput.focus();
        return;
    }

    const todo = {
        id: crypto.randomUUID(),
        text: todoInput.value.trim(),
        status: false,
    };

    todos.push(todo);

    // Сохраняем задачи в localStorage
    localStorage.setItem("todos", JSON.stringify(todos));

    renderTodo(todo);

    todoInput.value = "";
    todoInput.focus();
}

todoList.addEventListener("click", toggleComplete);
todoList.addEventListener("click", deleteTodo);

function renderTodo(todo) {
    const todoHTML = `
    <li id="txt2" data-book-id="${todo.id}" data-book-status="${todo.status}" class="flex items-center justify-between p-4 rounded-md shadow-md mb-2 ${todo.status ? 'bg-emerald-800' : ''}">
        <div>
            <h2 class="text-lg font-semibold">${todo.text}</h2>
        </div>
        <div class="flex items-center space-x-2">
            <label class="flex items-center space-x-1">
                <input type="checkbox" data-action="complete" class="h-5 w-5" ${todo.status ? 'checked' : ''}>
            </label>
            <button data-action="delete" class="bg-red-900 text-white px-2 py-1 rounded-md hover:bg-red-700 transition = ".1s linar">Удалить</button>
        </div>
    </li>
    `;

    todoList.insertAdjacentHTML("beforeend", todoHTML);

    if (todoList.children.length >= 1) {
        noTodoMessage.classList.add("hidden");
    }
}

function toggleComplete(evt) {

    if (evt.target.dataset.action !== "complete") {
        return;
    }

    const completedTodo = evt.target;
    const todo = completedTodo.closest("li");
    todo.classList.toggle('bg-emerald-800'); // Добавляем класс для завершенной задачи
    const todoStatus = todo.dataset.bookStatus === 'false' ? false : true;
    todo.dataset.bookStatus = !todoStatus;

    const todoId = todo.dataset.bookId;
    const foundTodo = todos.find((todo) => todo.id === todoId);
    foundTodo.status = !todoStatus; // Обновляем статус задачи

    // Сохраняем изменения в localStorage
    localStorage.setItem("todos", JSON.stringify(todos));
}

function deleteTodo(evt) {

    if (evt.target.dataset.action !== "delete") {
        return;
    }

    const deleteButton = evt.target;
    const todo = deleteButton.closest("li");
    const todoId = todo.dataset.bookId;
    const todoIndex = todos.findIndex((todo) => todo.id === todoId);

    todos.splice(todoIndex, 1); // Удаляем задачу из массива

    localStorage.setItem("todos", JSON.stringify(todos)); // Сохраняем обновленный список задач

    todo.remove();

    if (todoList.children.length === 0) {
        noTodoMessage.classList.remove("hidden");
    }
}
