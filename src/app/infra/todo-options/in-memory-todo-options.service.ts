import { Observable, delay, of } from "rxjs";
import { TodoOptionsGateway } from "./todo-options.gateway";
import { TodoOptions } from "./todo-options.model";

export class InMemoryTodoOptionsService implements TodoOptionsGateway {

    constructor(private options: TodoOptions) {}

    get(): Observable<TodoOptions> {
        return of(this.options);
    }

}