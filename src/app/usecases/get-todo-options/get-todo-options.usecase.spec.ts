import { TestScheduler } from "rxjs/testing";
import { ALL_ITEM_OPTIONS, REMAINING_ITEM_OPTIONS, SchedulerMultipleTodoOptionsGateway } from '../../infra/todo-options/todo-options.fixture';
import { GetTodoOptionsUsecase } from "./get-todo-options.usecase";
import { TodoOptionsBuilder } from "./todo-options.builder";

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

        const optionsGateway = givenTodoOptions(optionProducer, optionsValues);
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

    function givenTodoOptions(marbles: string, values: any) {
        return new SchedulerMultipleTodoOptionsGateway(testScheduler, marbles, values);
    }
});