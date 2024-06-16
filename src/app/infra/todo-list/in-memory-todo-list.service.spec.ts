import { TestScheduler } from "rxjs/testing";
import { CreateTodoItem } from "./create-todo-item.model";
import { InMemoryTodoListService } from "./in-memory-todo-list.service";
import { TodoItemEventBuilder } from "./todo-item-event.builder";
import { oneTodo } from "./todo-list.fixture";

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

            const builder = new TodoItemEventBuilder().isUpdate();
            const todoItemConsumedValues = {
                a: builder.withItemTodo(oneTodo(1, true)).build(),
                b: builder.withItemTodo(oneTodo(1, false)).build()
            };

            const todoProducer$ = testScheduler.createColdObservable(todoProducer, todoItemValues);
            const inMemoryTodoListService = new InMemoryTodoListService([]);

            // WHEN
            todoProducer$.subscribe(t => inMemoryTodoListService.update(t));
            const res$ = inMemoryTodoListService.get();

            // THEN
            testScheduler.expectObservable(res$).toBe(consumer, todoItemConsumedValues);
            testScheduler.flush();
        });

        it("Example : Empty list create event generate a new id ", () => {
            // GIVEN
            const todoProducer = '-a';
            const consumer     = '-a';

            const todoItemValues = {
                a: { title: "My item 1" } as CreateTodoItem
            };

            const builder = new TodoItemEventBuilder();
            const createdItemValue = {
                a: builder.withItemTodo(oneTodo(1)).build()
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
                a: { title: "My item 2" } as CreateTodoItem
            };

            const builder = new TodoItemEventBuilder();
            const createdItemValue = {
                a: builder.withItemTodo(oneTodo(2)).build()
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