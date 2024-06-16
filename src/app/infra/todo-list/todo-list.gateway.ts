import { Observable } from "rxjs";
import { TodoItem } from "./todo-item.model";
import { CreateTodoItem } from "./create-todo-item.model";
import { TodoItemEvent } from "./todo-item-event.model";

export abstract class TodoListGateway {

    abstract getAll(): Observable<TodoItem[]>;
}

export abstract class UpdateTodoItemGateway {

    abstract update(item: TodoItem): void;
}

export abstract class CreateTodoItemGateway {

    abstract create(item: CreateTodoItem): void;
}

export abstract class GetTodoItemEvents {
    
    abstract get(): Observable<TodoItemEvent>;
}