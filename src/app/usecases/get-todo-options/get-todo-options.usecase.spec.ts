import { Observable } from "rxjs";
import { TestScheduler } from "rxjs/testing";
import { TodoItem } from "../../infra/todo-list/todo-item.model";
import { SchedulerGetTodoItemEvents, SchedulerTodoListGateway, oneTodo } from "../../infra/todo-list/todo-list.fixture";
import { GetTodoItemEvents, TodoListGateway } from "../../infra/todo-list/todo-list.gateway";
import { ALL_ITEM_OPTIONS, REMAINING_ITEM_OPTIONS, SchedulerMultipleTodoOptionsGateway, SchedulerTodoOptionsGateway } from '../../infra/todo-options/todo-options.fixture';
import { TodoOptionsGateway } from "../../infra/todo-options/todo-options.gateway";
import { TodoOptions } from "../../infra/todo-options/todo-options.model";
import { TodoListService } from "../../services/todo-list.service";
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
        // todoListGateway      '-a-------';
        const optionProducer  = '-a--b---a';
        const firstConsumer   = '-a--b---a';
        const delaySubs       = '--^------';
        const delayConsumer   = '--a-b---a';

        const optionsValues = {
            a: REMAINING_ITEM_OPTIONS,
            b: ALL_ITEM_OPTIONS
        };

        const optionsGateway = givenTodoOptions(optionProducer, optionsValues);
        const todoListGateway = givenTodoListGateway([]);
        const getTodoOptionUsecase = createUsecase(todoListGateway, optionsGateway);

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

    it("Example: Count items by check status", () => {
        // GIVEN
        const optionsGateway = givenTodoOption(REMAINING_ITEM_OPTIONS);
        const todoListGateway = givenTodoListGateway([oneTodo(1, true), oneTodo(2, false), oneTodo(3, true)]);
        const getTodoOptionUsecase = createUsecase(todoListGateway, optionsGateway);

        // WHEN
        const res$ = getTodoOptionUsecase.run();

        // THEN
        expectOptionsWithCounter(res$);
        testScheduler.flush();
    });

    function createUsecase(todoListGateway: TodoListGateway,
                            todoOptionGateway: TodoOptionsGateway,
                            getTodoItemEvents: GetTodoItemEvents = givenTodoItemEvents('-')) {
        const todoListService = new TodoListService(todoListGateway, getTodoItemEvents);
        return new GetTodoOptionsUsecase(todoOptionGateway, todoListService);
    }

    function givenTodoOptions(marbles: string, values: any) {
        return new SchedulerMultipleTodoOptionsGateway(testScheduler, marbles, values);
    }

    function givenTodoOption(value: TodoOptions) {
        return new SchedulerTodoOptionsGateway(testScheduler, value);
    }
    
    function givenTodoListGateway(items: TodoItem[]) {
        return new SchedulerTodoListGateway(testScheduler, items);
    }

    function givenTodoItemEvents(events: string, value?: any) {
        return new SchedulerGetTodoItemEvents(testScheduler, events, value);
    }

    function expectOptionsWithCounter(res$: Observable<TodoOptions>) {
        const expectedValue = {
            a: new TodoOptionsBuilder().withRemaining(true).withCounters(1, 3).build()
        };

        testScheduler.expectObservable(res$).toBe('a', expectedValue);
    }
});