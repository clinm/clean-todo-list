import { Observable } from "rxjs";
import { TestScheduler } from "rxjs/testing";
import { TodoItem } from "./todo-item.model";
import { GetTodoItemEvents, TodoListGateway } from "./todo-list.gateway";
import { TodoItemEvent } from "./todo-item-event.model";

export function oneTodo(id: number, checked: boolean = false): TodoItem {
    return {id: id, title: "My item " + id, checked: checked};
}

export class SchedulerTodoListGateway implements TodoListGateway {

    constructor(private testScheduler: TestScheduler, private values: TodoItem[]) { }

    getAll(): Observable<TodoItem[]> {
        return this.testScheduler.createColdObservable('-a', { a: this.values});
    }
}

export class SchedulerErrorTodoListGateway implements TodoListGateway {
    constructor(private testScheduler: TestScheduler, private value: any) { }

    getAll(): Observable<TodoItem[]> {
        return this.testScheduler.createColdObservable('--#', undefined, this.value);
    }
}

export class SchedulerGetTodoItemEvents implements GetTodoItemEvents {

    constructor(private testScheduler: TestScheduler, private events: string, private values?: any) { }

    get(): Observable<TodoItemEvent> {
        return this.testScheduler.createColdObservable(this.events, this.values);
    }
}