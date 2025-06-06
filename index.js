const todoForm = document.querySelector('#js_form');
const todoBody = document.querySelector('.todo_body');
const count = document.querySelector('.count_items_left');
const clear = document.querySelector('.clear_js');
let todos = [];
window.addEventListener('load', handleWindowLoad);
todoForm.addEventListener('submit', handleFormSubmit);
todoBody.addEventListener('click', handleFormAction);
clear.addEventListener('click', handleClearTodos);
function handleWindowLoad() {
    const localStorageTodos = JSON.parse(localStorage.getItem('todos'));
    todos = localStorageTodos || [];
    if (todos.length === 0) {
        renderEmptyState();
    } else {
        renderTodoList();
        todos.forEach(todo => renderTodo(todo));
    }
    updateListCount();
}
function renderEmptyState() {
    todoBody.innerHTML = `
        <div class="empty">
            <p class="title_body">Have you planned for today..!</p>
        </div>
    `;
}
function renderTodoList() {
    todoBody.innerHTML = `<ul class="todo_list"></ul>`;
}
function renderTodo(todo) {
    const list = document.querySelector('.todo_list');
    const isChecked = todo.status === 'completed' ? 'checked' : '';
    const li = document.createElement('li');
    li.dataset.id = todo.id;
    li.dataset.status = todo.status;
    li.innerHTML = `
        <label for="${todo.id}">
            <input type="checkbox" ${isChecked} id="${todo.id}" />
            <input type="text" value="${todo.task}" readonly />
        </label>
        <div class="actions">
            <button class="js_edit">
                <i class="fa-solid fa-pencil" style="color: #C059B7;"></i>
            </button>
            <button class="js_delete">
                <i class="fa-solid fa-trash" style="color: #0F0B0D;"></i>
            </button>
        </div>
    `;
    list.appendChild(li);
}
function updateListCount() {
    count.textContent = `${todos.length} item${todos.length !== 1 ? 's' : ''} left`;
}
function handleFormSubmit(e) {
    e.preventDefault();
    const input = todoForm.querySelector('input');
    const todo = input.value.trim();
    if (todo === '') return;
    const myTodo = {
        id: Date.now(),
        task: todo,
        status: 'pending'
    };
    todos.push(myTodo);
    localStorage.setItem('todos', JSON.stringify(todos));
    input.value = '';
    if (todos.length === 1) renderTodoList();
    renderTodo(myTodo);
    updateListCount();
}
function handleFormAction(e) {
    updateStatus(e);
    deleteTodo(e);
    toggleInputState(e);
}
function updateStatus(e) {
    const checkbox = e.target.closest('input[type="checkbox"]');
    if (!checkbox) return;
    const li = checkbox.closest('li');
    const id = li.dataset.id;
    const newStatus = checkbox.checked ? 'completed' : 'pending';
    const index = todos.findIndex(todo => todo.id == id);
    todos[index].status = newStatus;
    li.dataset.status = newStatus;
    localStorage.setItem('todos', JSON.stringify(todos));
}
function deleteTodo(e) {
    const deleteBtn = e.target.closest('.js_delete');
    if (!deleteBtn) return;
    const li = deleteBtn.closest('li');
    const id = li.dataset.id;
    todos = todos.filter(todo => todo.id != id);
    li.remove();
    localStorage.setItem('todos', JSON.stringify(todos));
    if (todos.length === 0) renderEmptyState();
    updateListCount();
}
function toggleInputState(e) {
    const editBtn = e.target.closest('.js_edit');
    if (!editBtn) return;
    const li = editBtn.closest('li');
    const input = li.querySelector('input[type="text"]');
    input.toggleAttribute('readonly');
    input.focus();
    input.addEventListener('blur', () => {
        const id = li.dataset.id;
        updateTodo(id, input.value);
        input.setAttribute('readonly', true);
    }, { once: true });
}
function updateTodo(id, value) {
    const index = todos.findIndex(todo => todo.id == id);
    todos[index].task = value;
    localStorage.setItem('todos', JSON.stringify(todos));
}
function handleClearTodos() {
    todos = [];
    localStorage.setItem('todos', JSON.stringify(todos));
    renderEmptyState();
    updateListCount();
}
