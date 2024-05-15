import { TodoItem } from "./todo-item.model";

export function oneTodo(id: number, checked: boolean = false): TodoItem {
        return {id: id, title: "My item " + id, checked: checked};
}