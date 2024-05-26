import { Observable } from "rxjs";
import { TodoOptions } from "./todo-options.model";

export abstract class TodoOptionsGateway {

    abstract get(): Observable<TodoOptions>;
}

export abstract class UpdateTodoOptionsGateway {

    abstract update(options: TodoOptions): void;
}