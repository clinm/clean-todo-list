import { Observable } from "rxjs";
import { TodoItem } from "./todo-item.model";

export abstract class TodoListGateway {

    abstract getAll(): Observable<TodoItem[]>;
}

export abstract class UpdateTodoItemGateway {

    abstract update(item: TodoItem): void;
}

export abstract class GetTodoItemEvents {
    
    abstract get(): Observable<TodoItem>;
}