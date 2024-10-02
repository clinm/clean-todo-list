import { TestScheduler } from "rxjs/testing";
import { TodoOptionsGateway } from "./todo-options.gateway";
import { TodoOptions } from "./todo-options.model";
import { Observable } from "rxjs";

export const ALL_ITEM_OPTIONS: TodoOptions = { remaining: false };

export const REMAINING_ITEM_OPTIONS: TodoOptions = { remaining: true };

export class SchedulerTodoOptionsGateway implements TodoOptionsGateway {

    constructor(private testScheduler: TestScheduler, private value: TodoOptions) { }

    get(): Observable<TodoOptions> {
        return this.testScheduler.createColdObservable('a', { a: this.value });
    }
}

export class SchedulerMultipleTodoOptionsGateway implements TodoOptionsGateway {

    constructor(private testScheduler: TestScheduler, private marbles: string, private values: any) { }

    get(): Observable<TodoOptions> {
        return this.testScheduler.createColdObservable(this.marbles, this.values);
    }
}