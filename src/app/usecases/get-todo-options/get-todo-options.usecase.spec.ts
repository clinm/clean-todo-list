import { GetTodoOptionsUsecase } from "./get-todo-options.usecase";
import { ALL_ITEM_OPTIONS, REMAINING_ITEM_OPTIONS } from '../../infra/todo-options/todo-options.fixture';
import { TodoOptionsBuilder } from "./todo-options.builder";
import { TestScheduler } from "rxjs/testing";
import { TodoOptionsGateway } from "../../infra/todo-options/todo-options.gateway";
import { Observable } from "rxjs";
import { TodoOptions } from "../../infra/todo-options/todo-options.model";

describe("Feature: Options", () => {

    let testScheduler: TestScheduler;

    beforeEach(() => {
        testScheduler = new TestScheduler((actual, expected) => {
            return expect(actual).toEqual(expected);
        });
    });

    it("Example: Get stored options change events", () => {
        // GIVEN
        const optionProducer  = 'a--b---a';
        const firstConsumer   = 'a--b---a';
        const delaySubs       = '-^------';
        const delayConsumer   = '-a-b---a';

        const optionsValues = {
            a: REMAINING_ITEM_OPTIONS,
            b: ALL_ITEM_OPTIONS
        };

        const optionsProducer = testScheduler.createColdObservable(optionProducer, optionsValues);
        const optionsGateway = new SchedulerTodoOptionsService(optionsProducer);
        const getTodoOptionUsecase = new GetTodoOptionsUsecase(optionsGateway);

        const consumedValues = {
            a: new TodoOptionsBuilder().withRemaining(true).build(),
            b: new TodoOptionsBuilder().withRemaining(false).build()
        };

        // WHEN
        const res$ = getTodoOptionUsecase.run();
        const resDelayed$ = getTodoOptionUsecase.run();

        // THEN
        testScheduler.expectObservable(res$).toBe(firstConsumer, consumedValues);
        testScheduler.expectObservable(resDelayed$, delaySubs).toBe(delayConsumer, consumedValues);
        testScheduler.flush();
    });

    class SchedulerTodoOptionsService implements TodoOptionsGateway {

        constructor(private options: Observable<TodoOptions>) {}
    
        get(): Observable<TodoOptions> {
            return this.options;
        }
    
    }
});