import { TestScheduler } from "rxjs/testing";
import { oneTodo } from "./todo-list.fixture";
import { InMemoryTodoListService } from "./in-memory-todo-list.service";
import { TodoItem } from "./todo-item.model";
import { CreateTodoItem } from "./create-todo-item.model";

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

        it("Example : Empty list create event generate a new id ", () => {
            // GIVEN
            const todoProducer = '-a';
            const consumer     = '-a';

            const todoItemValues = {
                a: { title: "My added item" } as CreateTodoItem
            };

            const createdItemValue = {
                a: { id: 1, title: "My added item", checked: false} as TodoItem
            }

            const todoProducer$ = testScheduler.createColdObservable(todoProducer, todoItemValues);
            const inMemoryTodoListService = new InMemoryTodoListService([]);

            // WHEN
            todoProducer$.subscribe(t => inMemoryTodoListService.create(t));
            const res$ = inMemoryTodoListService.get();

            // THEN
            testScheduler.expectObservable(res$).toBe(consumer, createdItemValue);
            testScheduler.flush();
        });

        it("Example : create event generates a new item with max id ", () => {
            // GIVEN
            const todoProducer = '-a';
            const consumer     = '-a';

            const todoItemValues = {
                a: { title: "My added item" } as CreateTodoItem
            };

            const createdItemValue = {
                a: { id: 2, title: "My added item", checked: false} as TodoItem
            }

            const todoProducer$ = testScheduler.createColdObservable(todoProducer, todoItemValues);
            const inMemoryTodoListService = new InMemoryTodoListService([oneTodo(1)]);

            // WHEN
            todoProducer$.subscribe(t => inMemoryTodoListService.create(t));
            const res$ = inMemoryTodoListService.get();

            // THEN
            testScheduler.expectObservable(res$).toBe(consumer, createdItemValue);
            testScheduler.flush();
        });

    });
});