import { TodoItem } from "./todo-item.model"

export enum TodoItemEventType {
    CREATE,
    UPDATE
}

export type TodoItemEvent = {
    type: TodoItemEventType,
    value: TodoItem
}