import { Observable, ReplaySubject } from "rxjs";
import { TodoItem } from "../infra/todo-list/todo-item.model";
import { GetTodoItemEvents, TodoListGateway } from "../infra/todo-list/todo-list.gateway";

export class TodoListService {

    private todoItems$ = new ReplaySubject<TodoItem[]>(1);

    private todoItems!: TodoItem[];

    constructor(private todoListGateway: TodoListGateway,
                private getTodoItemEvents: GetTodoItemEvents) {}

    public get(): Observable<TodoItem[]> {
        this.todoListGateway
            .getAll()
            .subscribe(res => {
                this.todoItems = res;
                this.todoItems$.next(res);
            });

        this.getTodoItemEvents
            .get()
            .subscribe(event => this.upsert(event));

        return this.todoItems$.asObservable();
    }

    private upsert(event: TodoItem) {
        const index = this.todoItems.findIndex(item => item.id === event.id);

        if (index > -1) {
            this.todoItems.splice(index, 1, event);
        } else {
            this.todoItems.push(event);
        }
        this.todoItems$.next(this.todoItems);
    }
}