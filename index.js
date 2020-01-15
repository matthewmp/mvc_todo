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
    }

    // Loop through todos and find by id, replace text
    editTodo(id, updatedText) {
        this.todos = this.todos.map(todo => 
            todo.id === id ? { id: todo.id, text: updatedText, complete: todo.complete } : todo
        )
    }

    // Filter out all todos that don't match id
    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
    }

    // Toggle the complete status of a todo
    toggleTodo(id) {
        this.todos = this.todos.map(todo => 
                todo.id === id ? { id: todo.id, text: todo.text, complete: !todo.complete } : todo
        )
    }
}




// Run todo
var md = new Model();
md.addTodo('Food Shopping');
md.editTodo(3, 'Nap')
md.toggleTodo(1)