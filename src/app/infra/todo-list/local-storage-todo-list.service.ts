import { Observable, Subject, of } from "rxjs";
import { CreateTodoItem } from "./create-todo-item.model";
import { TodoItemEvent } from "./todo-item-event.model";
import { TodoItem } from "./todo-item.model";
import { CreateTodoItemGateway, GetTodoItemEvents, TodoListGateway, UpdateTodoItemGateway } from "./todo-list.gateway";
import { TodoItemEventBuilder } from "./todo-item-event.builder";

export class LocalStorageTodoListService implements TodoListGateway, UpdateTodoItemGateway, GetTodoItemEvents, CreateTodoItemGateway {
    
    private readonly updateTodoItemSubject = new Subject<TodoItemEvent>();
    
    private todos!: TodoItem[];

    private lastId: number;

    constructor() {
        this.fetchAll();
        this.lastId = this.todos.map(t => t.id).pop() ?? 0;
    }

    getAll(): Observable<TodoItem[]> {
        return of(JSON.parse(JSON.stringify(this.todos)));
    }
    
    get(): Observable<TodoItemEvent> {
        return this.updateTodoItemSubject.asObservable();
    }
    
    update(item: TodoItem): void {
        const event = new TodoItemEventBuilder().isUpdate().withItemTodo(item).build();

        this.updateList(item);
        this.saveAll();

        this.updateTodoItemSubject.next(event);
    }
    
    create(item: CreateTodoItem): void {
        const newItem = this.fromCreate(item);
        this.todos.push(newItem);
        this.saveAll();
        const event = new TodoItemEventBuilder().withItemTodo(newItem).build();
        this.updateTodoItemSubject.next(event);
    }

    private fetchAll() {
        const stored = localStorage.getItem("TODOS");
        this.todos = [];
        if (stored) {
            this.todos = JSON.parse(stored) as TodoItem[];
        }
    }

    private fromCreate(item: CreateTodoItem): TodoItem {
        this.lastId++;
        return { id: this.lastId, title: item.title, checked: false};
    }

    private saveAll(): void {
        localStorage.setItem("TODOS", JSON.stringify(this.todos));
    }

    private updateList(update: TodoItem): void {
        const index = this.todos.findIndex(item => item.id === update.id);
        this.todos.splice(index, 1, update);
    }
}

