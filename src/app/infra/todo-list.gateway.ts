import { Observable } from "rxjs";
import { TodoItem } from "./todo-item.model";

export abstract class TodoListGateway {

    abstract getAll(): Observable<TodoItem[]>;
}