import { TestScheduler } from "rxjs/testing";
import { CreateTodoItem } from "./create-todo-item.model";
import { InMemoryTodoListService } from "./in-memory-todo-list.service";
import { TodoItemEventBuilder } from "./todo-item-event.builder";
import { oneTodo } from "./todo-list.fixture";
import { Observable } from "rxjs";
import { TodoItemEvent } from "./todo-item-event.model";
import { TodoItem } from "./todo-item.model";

describe("Infra > TodoList Gateway", () => {

    let testScheduler: TestScheduler;
    
    let res$: Observable<TodoItemEvent>;

    let createProducer$: Observable<CreateTodoItem>;

    let inMemoryTodoListService: InMemoryTodoListService;

    beforeEach(() => {
        testScheduler = new TestScheduler((actual, expected) => {
            return expect(actual).toEqual(expected);
        });
    });

    describe("TodoItem update events", () => {

        let updateProducer$: Observable<TodoItem>;

        it("Example : Give update events ", () => {
            // GIVEN
            const todoProducer = '-a--b-';
            const consumer     = '-a--b-';
            givenEventProduced(todoProducer);
            givenInitialMemory([]);
            
            // WHEN
            whenSubscribe();
            
            // THEN
            expectUpdateEvents(consumer);
        });

        function givenEventProduced(producerMarbles: string) {
            const todoItemValues = {
                a: oneTodo(1, true),
                b: oneTodo(1, false)
            };
            
            updateProducer$ = testScheduler.createColdObservable(producerMarbles, todoItemValues);
        }

        function whenSubscribe() {
            updateProducer$.subscribe(t => inMemoryTodoListService.update(t));
            res$ = inMemoryTodoListService.get();
        }

        function expectUpdateEvents(consumerMarbles: string) {
            const builder = new TodoItemEventBuilder().isUpdate();
            const todoItemConsumedValues = {
                a: builder.withItemTodo(oneTodo(1, true)).build(),
                b: builder.withItemTodo(oneTodo(1, false)).build()
            };
            testScheduler.expectObservable(res$).toBe(consumerMarbles, todoItemConsumedValues);
            testScheduler.flush();
        }
    });

    describe("TodoItem create events", () => {

        it("Example : Empty list create event generate a new id ", () => {
            // GIVEN
            givenEventProduced(1);
            givenInitialMemory([]);

            // WHEN
            whenSubscribe();

            // THEN
            expectCreateEventWithOneTodo(1);
        });

        it("Example : create event generates a new item with max id ", () => {
            // GIVEN
            givenEventProduced(2);
            givenInitialMemory([oneTodo(1)]);

            // WHEN
            whenSubscribe();

            // THEN
            expectCreateEventWithOneTodo(2);
        });

        function givenEventProduced(id: number) {
            const todoItemValues = {
                a: { title: "My item " + id } as CreateTodoItem
            };

            createProducer$ = testScheduler.createColdObservable('-a', todoItemValues);
        }

        function whenSubscribe() {
            createProducer$.subscribe(t => inMemoryTodoListService.create(t));
            res$ = inMemoryTodoListService.get();
        }

        function expectCreateEventWithOneTodo(id: number) {
            const builder = new TodoItemEventBuilder();
            const createdItemValue = {
                a: builder.withItemTodo(oneTodo(id)).build()
            }

            testScheduler.expectObservable(res$).toBe('-a', createdItemValue);
            testScheduler.flush();
        }

    });

    function givenInitialMemory(items: TodoItem[]) {
        inMemoryTodoListService = new InMemoryTodoListService(items);
    }
});