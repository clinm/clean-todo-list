import { ItemVM, TodoListVM, TodoListViewModelType } from "./todo-list.vm";

export class TodoListBuilder {

    protected type!: TodoListViewModelType; 

    protected items!: ItemVM[];

    public withType(type: TodoListViewModelType): this {
        this.type = type;
        return this;
    }

    public withItems(items: ItemVM[]) {
        this.items = items;
        return this;
    }

    public build(): TodoListVM {
        let res: TodoListVM;

        switch(this.type) {
            case TodoListViewModelType.NoTodo:
                res = { type: this.type }
                break;
            case TodoListViewModelType.Todos:
                res = { type: TodoListViewModelType.Todos, items: this.items};
                break;
        }

        return res;
    }
}