import { Observable } from "rxjs";
import { TestScheduler } from "rxjs/testing";
import { TodoItem } from "./todo-item.model";
import { GetTodoItemEvents, TodoListGateway } from "./todo-list.gateway";
import { TodoItemEvent } from "./todo-item-event.model";

export function oneTodo(id: number, checked: boolean = false): TodoItem {
    return {id: id, title: "My item " + id, checked: checked};
}

export class SchedulerTodoListGateway implements TodoListGateway {

    constructor(private readonly testScheduler: TestScheduler, private readonly values: TodoItem[]) { }

    getAll(): Observable<TodoItem[]> {
        return this.testScheduler.createColdObservable('a', { a: this.values});
    }
}

export class SchedulerGetTodoItemEvents implements GetTodoItemEvents {

    constructor(private readonly testScheduler: TestScheduler, private readonly events: string, private readonly values?: any) { }

    get(): Observable<TodoItemEvent> {
        return this.testScheduler.createColdObservable(this.events, this.values);
    }
}