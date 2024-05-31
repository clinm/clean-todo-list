import { Observable, ReplaySubject, Subject, tap } from "rxjs";
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
            .subscribe(event => {
                const index = this.todoItems.findIndex(item => item.id === event.id);
                this.todoItems.splice(index, 1, event);
                this.todoItems$.next(this.todoItems);
            });

        return this.todoItems$.asObservable();
    }
}