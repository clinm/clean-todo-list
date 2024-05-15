import { Observable, delay, of } from "rxjs";
import { TodoItem } from "./todo-item.model";
import { TodoListGateway } from "./todo-list.gateway";

export class InMemoryTodoListService implements TodoListGateway {

    constructor(private todos: TodoItem[], private delay: number = 0) {}

    getAll(): Observable<TodoItem[]> {
        return of(this.todos).pipe(delay(this.delay));
    }

}