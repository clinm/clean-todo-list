import { Observable, Subject, delay, of } from "rxjs";
import { TodoItem } from "./todo-item.model";
import { GetTodoItemEvents, TodoListGateway, UpdateTodoItemGateway } from "./todo-list.gateway";

export class InMemoryTodoListService implements TodoListGateway, UpdateTodoItemGateway, GetTodoItemEvents {

    private updateTodoItemSubject = new Subject<TodoItem>();

    constructor(private todos: TodoItem[], private delay: number = 0) {}
    
    getAll(): Observable<TodoItem[]> {
        return of(this.todos).pipe(delay(this.delay));
    }
    
    get(): Observable<TodoItem> {
        return this.updateTodoItemSubject.asObservable();
    }

    update(item: TodoItem): void {
        this.updateTodoItemSubject.next(item);
    }
}