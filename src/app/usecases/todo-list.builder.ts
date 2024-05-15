import { TodoListVM, TodoListViewModelType } from "./todo-list.vm";

export class TodoListBuilder {

    protected type!: TodoListViewModelType; 

    protected message!: string;

    public withType(type: TodoListViewModelType): this {
        this.type = type;
        return this;
    }

    public withMessage(message: string): this {
        this.message = message;
        return this;
    }

    public build(): TodoListVM {
        let res: TodoListVM;

        switch(this.type) {
            case TodoListViewModelType.NoTodo: 
                res = { type: TodoListViewModelType.NoTodo, message: this.message}
                break;
        }

        return res;
    }
}