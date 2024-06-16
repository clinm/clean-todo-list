import { Observable, Subject, delay, of } from "rxjs";
import { TodoItem } from "./todo-item.model";
import { CreateTodoItemGateway, GetTodoItemEvents, TodoListGateway, UpdateTodoItemGateway } from "./todo-list.gateway";
import { CreateTodoItem } from "./create-todo-item.model";

export class InMemoryTodoListService implements TodoListGateway, UpdateTodoItemGateway, GetTodoItemEvents, CreateTodoItemGateway {

    private updateTodoItemSubject = new Subject<TodoItem>();

    private lastId: number;

    constructor(private todos: TodoItem[], private delay: number = 0) {
        this.lastId = this.todos.map(t => t.id).pop() ?? 0;
    }
    
    getAll(): Observable<TodoItem[]> {
        return of(this.todos).pipe(delay(this.delay));
    }
    
    get(): Observable<TodoItem> {
        return this.updateTodoItemSubject.asObservable();
    }

    update(item: TodoItem): void {
        this.updateTodoItemSubject.next(item);
    }

    create(item: CreateTodoItem): void {
        const newItem = this.fromCreate(item);
        this.updateTodoItemSubject.next(newItem);
    }

    private fromCreate(item: CreateTodoItem): TodoItem {
        this.lastId++;
        return { id: this.lastId, title: item.title, checked: false};
    }
}

