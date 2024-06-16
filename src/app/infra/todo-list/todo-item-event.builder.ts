import { TodoItemEvent, TodoItemEventType } from "./todo-item-event.model";
import { TodoItem } from "./todo-item.model";

export class TodoItemEventBuilder {

    protected type: TodoItemEventType = TodoItemEventType.CREATE;

    protected item!: TodoItem;

    public isUpdate(): this {
        this.type = TodoItemEventType.UPDATE;
        return this;
    }

    public withItemTodo(item: TodoItem): this {
        this.item = item;
        return this;
    }

    public build(): TodoItemEvent {
        return { type: this.type, value: this.item};
    }
}