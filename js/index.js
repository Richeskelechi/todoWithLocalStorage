let allTodos = []
// Retrieve the value from local storage.
const storedTodo = JSON.parse(localStorage.getItem('allTodos'));
// Check if the stored value has expired
if (storedTodo && storedTodo.expires && Date.now() < storedTodo.expires) {
  allTodos = storedTodo.todo
}
const uid = function () {
    return Date.now() + Math.floor(Math.random() * (99999999999999 - 11111111111111 + 1) + 11111111111111)
}

let todoContainer = document.getElementById("todoContainer")
let notice = document.getElementById("notify")
const clearTodos = () => {
    while (todoContainer.hasChildNodes()) {
        todoContainer.removeChild(todoContainer.firstChild)
    }
}

const showTodos = (allTodos) => {
    let strike = ""
    if (allTodos == null || allTodos.length == 0) {
    } else {
        notice.style.display = "none"
        const mappedTodos = allTodos.map((todo, index) => {
            let displayName = ""
            if (todo.todoItem.length > 20) {
                displayName = todo.todoItem.slice(0, 20) + "..."
            } else {
                displayName = todo.todoItem
            }
            if (todo.isCompleted) strike = 'strike'
            return `<div class="eachTodo" key=${index + 1}>
                <div class="todoId todoHover">${index + 1}</div>
                <div ondblclick="strike(${todo.todoId}, '${todo.isCompleted}')" title="${todo.todoItem}" class="todoName todoHover ${strike}">${displayName}</div>
                <div class="todoEdit todoHover">
                    <i onclick="editTodo(${todo.todoId})" class="fa-sharp fa-solid fa-pencil icon"></i>
                </div>
                <div class="todoDelete todoHover">
                    <i onclick="deleteTodo(${todo.todoId})" class="fa-sharp fa-solid fa-trash icon"></i>
                </div>
            </div>`
        })
        todoContainer.innerHTML = mappedTodos
    }
}
document.addEventListener("DOMContentLoaded", () => {
    clearTodos()
    showTodos(allTodos)
});
const editTodo = (id) => {
    todoIndex = allTodos.findIndex((todo => todo.todoId == id));
    if (todoIndex !== -1) {
        let selectedTodo = allTodos[todoIndex]
        document.getElementById("todoName").value = selectedTodo.todoItem
        document.getElementById("todoId").value = selectedTodo.todoId
        document.getElementById("btn").value = "Update Todo"
    } else {
        alert("Invalid Todo Item")
    }
}
const deleteTodo = (id) => {
    todoIndex = allTodos.findIndex((todo => todo.todoId == id));
    if (todoIndex !== -1) {
        const answer = confirm(`Are you sure you want to Delete This Todo Item ?`)
        if (answer) {
            allTodos.splice(todoIndex, 1);
            clearTodos()
            showTodos(allTodos)
            saveToLocalStorage(allTodos)
            document.getElementById("todoName").value = ""
            document.getElementById("todoId").value = "newTodo"
            document.getElementById("btn").value = "Add Todo"
        }
    } else {
        alert("Invalid Todo Item")
    }
}
const strike = (id, status) => {
    let value = ""
    if (status == 'false') {
        value = 'Completed'
    } else {
        value = 'Not Completed'
    }
    const answer = confirm(`Are you sure you want to Mark This Todo As ${value} ?`)
    if (answer) {
        todoIndex = allTodos.findIndex((todo => todo.todoId == id));
        allTodos[todoIndex].isCompleted = !allTodos[todoIndex].isCompleted;
        clearTodos()
        showTodos(allTodos)
        saveToLocalStorage(allTodos)
    }
}
const addTodos = (event) => {
    event.preventDefault();
    const name = document.getElementById("todoName").value
    const newTodoid = document.getElementById("todoId").value
    if (newTodoid === 'newTodo') {
        if (name == "") {
            alert("Please enter A Todo Item")
            return false
        }
        if (name.length < 5) {
            alert("Please A Todo Item Should Be At Least 5 Characters")
            return false
        }
        let id = uid()
        newTodoDetails = {
            todoId: id,
            todoItem: name.toLowerCase(),
            isCompleted: false,
            isDeleted: false,
        }
        document.getElementById("todoName").value = ""
        allTodos.push(newTodoDetails)
        clearTodos()
        showTodos(allTodos)
        saveToLocalStorage(allTodos)
    } else {
        if (name == "") {
            alert("Please enter A Todo Item")
        }
        if (name.length < 5) {
            alert("Please A Todo Item Should Be At Least 5 Characters")
        } else {
            const answer = confirm(`Are you sure you want to Edit This Todo Item ?`)
            if (answer) {
                todoIndex = allTodos.findIndex((todo => todo.todoId == newTodoid));
                allTodos[todoIndex].todoItem = name
                document.getElementById("todoName").value = ""
                document.getElementById("todoId").value = "newTodo"
                document.getElementById("btn").value = "Add Todo"
                clearTodos()
                showTodos(allTodos)
                // Store in local storage
                saveToLocalStorage(allTodos)
            }
        }
    }
}
document.getElementById('addNewTodos').addEventListener('submit', addTodos);

function saveToLocalStorage(allTodos) {
    //The time is 1440m which is 24hours from now
    const expirationTimestamp = Date.now() + (1440 * 60 * 1000);
    // Delete the axisting item from local storage
    localStorage.removeItem('allTodos');
    // Store the encrypted value and expiration timestamp in local storage
    localStorage.setItem('allTodos', JSON.stringify({ todo: allTodos, expires: expirationTimestamp }));
}
