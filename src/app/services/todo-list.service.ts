import { Observable, ReplaySubject } from "rxjs";
import { TodoItem } from "../infra/todo-list/todo-item.model";
import { GetTodoItemEvents, TodoListGateway } from "../infra/todo-list/todo-list.gateway";
import { TodoItemEvent, TodoItemEventType } from "../infra/todo-list/todo-item-event.model";

export class TodoListService {

    private todoItems$!: ReplaySubject<TodoItem[]>;

    private todoItems!: TodoItem[];

    constructor(private todoListGateway: TodoListGateway,
                private getTodoItemEvents: GetTodoItemEvents) {}

    public get(): Observable<TodoItem[]> {
        if (!this.todoItems$) {
            this.init();
        }

        return this.todoItems$.asObservable();
    }

    private init() {
        this.todoItems$ = new ReplaySubject(1);
        this.todoListGateway
            .getAll()
            .subscribe(res => {
                this.todoItems = res;
                this.todoItems$.next(res);
            });

        this.getTodoItemEvents
            .get()
            .subscribe(event => {
                this.handleEvent(event);
                this.todoItems$.next(this.todoItems);
            });
    }

    private handleEvent(event: TodoItemEvent): void {
        switch(event.type) {
            case TodoItemEventType.CREATE:
                this.insert(event.value);
                break;
            case TodoItemEventType.UPDATE:
                this.update(event.value);
                break;
        }
    }

    private insert(item: TodoItem): void {
        this.todoItems.push(item);
    }

    private update(update: TodoItem): void {
        const index = this.todoItems.findIndex(item => item.id === update.id);
        this.todoItems.splice(index, 1, update);
    }
}