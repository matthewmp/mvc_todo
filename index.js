class Model {
    constructor(){
        this.todos = [
            {id: 1, text: 'Run a marathon', complete: false},
            {id: 2, text: 'Go to the moon', complete: false}
        ]
    }

    // Add a todo, get id by looking at last id in list and increment
    addTodo(todoText) {
        const todo = {
            id: this.todos.length > 0 ? this.todos[this.todos.length - 1].id + 1 : 1,
            text: todoText,
            complete: false
        }

        this.todos.push(todo);
        this.onTodoListChanged(this.todos);
    }

    // Loop through todos and find by id, replace text
    editTodo(id, updatedText) {
        this.todos = this.todos.map(todo => 
            todo.id === id ? { id: todo.id, text: updatedText, complete: todo.complete } : todo
        );

        this.onTodoListChanged(this.todos);
    }

    // Filter out all todos that don't match id
    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.onTodoListChanged(this.todos);
    }

    // Toggle the complete status of a todo
    toggleTodo(id) {
        this.todos = this.todos.map(todo => 
                todo.id === id ? { id: todo.id, text: todo.text, complete: !todo.complete } : todo
        );
        this.onTodoListChanged(this.todos);
    }

    bindTodoListChanged(callback) {
        this.onTodoListChanged = callback;
    }
}


class View {
    constructor() {
        // Get app's root element
        this.app = this.getElement('#root');

        // Get Input for entering new todos
        this.input = this.getElement('#inp-todo-text');

        // Get submit button for entering todos
        this.submitButton = this.getElement('#btn-todo-submit');
    
        // The visual representation of the todo list
        this.todoList = this.getElement('.todo-list');

        // The form itself
        this.form = this.getElement('#form-todo');
    }

    // Create element with optional CSS class
    createElement(tag, className) {
        const el = document.createElement(tag);
        if(className) el.classList.add(className);

        return el;
    }

    // Retrieve element
    getElement(selector) {
        const el = document.querySelector(selector);

        return el;
    }

    // Getter for input value
    get _todoText() {
        return this.input.value;
    }

    // Reset input value
    _resetInput() {
        this.input.value = '';
    }

    // Display todos to list
    renderTodos(todos) {
        // Delete all nodes in list
        while(this.todoList.firstChild) {
            this.todoList.removeChild(this.todoList.firstChild);
        }
        
        // Show default message if no todos are left
        if(todos.length === 0) {
            const p = this.createElement('p');
            p.textContent = 'Nothing to do! Add a task.';
            p.id = 'Test'
            this.todoList.appendChild(p);
        } else {
            // Create new todo node for each item in state
            todos.forEach(todo => {
            const li = this.createElement('li');
            li.id = todo.id;

            // Create checkbox to mark todo as complete / incomplete
            const checkbox = this.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.complete;

            // Todo content inside editable span
            const span = this.createElement('span');
            span.contentEditable = true;
            span.classList.add('editable');

            // If completed allow striketrough text
            if(todo.complete) {
                const strike = this.createElement('s');
                strike.textContent = todo.text;
                span.append(strike);
            } else {
                span.textContent = todo.text;
            }

            // Add delete button for each todo
            const deleteButton = this.createElement('button', 'delete');
            deleteButton.textContent = 'Delete';
            li.append(checkbox, span, deleteButton);

            // Append node to list
            this.todoList.append(li);
            });                
        }
    }

    // Bind event handlers to controller
    bindAddTodo(handler) {
        this.form.addEventListener('submit', event => {
            event.preventDefault();

            if(this._todoText) {
                handler(this._todoText);
                this._resetInput();
            }
        });
    }

    bindDeleteTodo(handler) {
        this.todoList.addEventListener('click', event => {
            if(event.target.className === 'delete') {
                const id = parseInt(event.target.parentElement.id);
                
                handler(id);
            }
        })
    }

    bindToggleTodo(handler) {
        this.todoList.addEventListener('change', event => {
            if(event.target.type === 'checkbox') {
                const id = parseInt(event.target.parentElement.id);

                handler(id);
            }
        })
    }


}

class Controller {
    constructor(model, view) {
      this.model = model;
      this.view = view;

      // Display initial todos
      this.onTodoListChanged(this.model.todos);

      // Bind view's event listeners to controllers methods
      this.view.bindAddTodo(this.handleAddTodo);
      this.view.bindDeleteTodo(this.handleDeleteTodo);
      this.view.bindToggleTodo(this.handleToggleTodo);

      this.model.bindTodoListChanged(this.onTodoListChanged)
    }

    onTodoListChanged = todos => this.view.renderTodos(todos);

    handleAddTodo = todoText => this.model.addTodo(todoText);

    handleEditTodo = (id, todoText) => this.model.editTodo(id, todoText);

    handleDeleteTodo = id => this.model.deleteTodo(id);

    handleToggleTodo = id => this.model.toggleTodo(id);
  }


const app = new Controller(new Model(), new View());