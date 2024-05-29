import { BehaviorSubject, Observable } from "rxjs";
import { TodoOptionsGateway, UpdateTodoOptionsGateway } from "./todo-options.gateway";
import { TodoOptions } from "./todo-options.model";

export class InMemoryTodoOptionsService implements TodoOptionsGateway, UpdateTodoOptionsGateway {

    private optionsSubject: BehaviorSubject<TodoOptions>;

    constructor(private options: TodoOptions) {
        this.optionsSubject = new BehaviorSubject(this.options);
    }
    
    get(): Observable<TodoOptions> {
        return this.optionsSubject.asObservable();
    }
    
    update(options: TodoOptions): void {
        this.optionsSubject.next(options);
    }
}