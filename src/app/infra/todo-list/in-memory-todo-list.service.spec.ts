import { TestScheduler } from "rxjs/testing";
import { oneTodo } from "./todo-list.fixture";
import { InMemoryTodoListService } from "./in-memory-todo-list.service";

describe("Infra > TodoList Gateway", () => {

    let testScheduler: TestScheduler;

    beforeEach(() => {
        testScheduler = new TestScheduler((actual, expected) => {
            return expect(actual).toEqual(expected);
        });
    });

    describe("TodoItem update events", () => {
        it("Example : Give update events ", () => {
            // GIVEN
            const todoProducer = '-a--b-';
            const consumer     = '-a--b-';

            const todoItemValues = {
                a: oneTodo(1, true),
                b: oneTodo(1, false)
            };

            const todoProducer$ = testScheduler.createColdObservable(todoProducer, todoItemValues);
            const inMemoryTodoListService = new InMemoryTodoListService([]);

            // WHEN
            todoProducer$.subscribe(t => inMemoryTodoListService.update(t));
            const res$ = inMemoryTodoListService.get();

            // THEN
            testScheduler.expectObservable(res$).toBe(consumer, todoItemValues);
            testScheduler.flush();
        });
    });
});