import { Observable, Subject, of } from "rxjs";
import { CreateTodoItem } from "./create-todo-item.model";
import { TodoItemEventBuilder } from "./todo-item-event.builder";
import { TodoItemEvent } from "./todo-item-event.model";
import { TodoItem } from "./todo-item.model";
import { CreateTodoItemGateway, GetTodoItemEvents, TodoListGateway, UpdateTodoItemGateway } from "./todo-list.gateway";

export class InMemoryTodoListService implements TodoListGateway, UpdateTodoItemGateway, GetTodoItemEvents, CreateTodoItemGateway {

    private readonly updateTodoItemSubject = new Subject<TodoItemEvent>();

    private lastId: number;

    constructor(private readonly todos: TodoItem[]) {
        this.lastId = this.todos.map(t => t.id).pop() ?? 0;
    }
    
    getAll(): Observable<TodoItem[]> {
        return of(this.todos);
    }
    
    get(): Observable<TodoItemEvent> {
        return this.updateTodoItemSubject.asObservable();
    }

    update(item: TodoItem): void {
        const event = new TodoItemEventBuilder().isUpdate().withItemTodo(item).build();
        this.updateTodoItemSubject.next(event);
    }

    create(item: CreateTodoItem): void {
        const newItem = this.fromCreate(item);
        const event = new TodoItemEventBuilder().withItemTodo(newItem).build();
        this.updateTodoItemSubject.next(event);
    }

    private fromCreate(item: CreateTodoItem): TodoItem {
        this.lastId++;
        return { id: this.lastId, title: item.title, checked: false};
    }
}

