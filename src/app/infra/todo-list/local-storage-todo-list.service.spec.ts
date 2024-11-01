import { Observable } from "rxjs";
import { TestScheduler } from "rxjs/testing";
import { CreateTodoItem } from "./create-todo-item.model";
import { LocalStorageTodoListService } from "./local-storage-todo-list.service";
import { TodoItemEventBuilder } from "./todo-item-event.builder";
import { TodoItemEvent } from "./todo-item-event.model";
import { TodoItem } from "./todo-item.model";
import { oneTodo } from "./todo-list.fixture";

describe("Infra > LocalStorage TodoList Gateway", () => {

    let testScheduler: TestScheduler;
    
    let res$: Observable<TodoItemEvent>;

    let createProducer$: Observable<CreateTodoItem>;

    let localStorageTodoListService: LocalStorageTodoListService;

    beforeEach(() => {
        testScheduler = new TestScheduler((actual, expected) => {
            return expect(actual).toEqual(expected);
        });
    });

    describe("Fetch stored todo in local storage", () => {

        it("Example : should return empty list when no elements in storage", () => {
            const todos: TodoItem[] = [];
            givenStoredTodos(todos);

            const res$ = whenGetAll();

            thenTodosMatches(res$, todos);
        });

        it("Example : should return todo list elements in storage", () => {
            const todos: TodoItem[] = [oneTodo(1)];
            givenStoredTodos(todos);

            const res$ = whenGetAll();

            thenTodosMatches(res$, todos);
        });

        function whenGetAll(): Observable<TodoItem[]> {
            localStorageTodoListService = new LocalStorageTodoListService();
            return localStorageTodoListService.getAll();
        }

        function thenTodosMatches(res$: Observable<TodoItem[]>, expected: TodoItem[]) {
            res$.subscribe(res => {
                expect(res).toEqual(expected)
            });
        }
    });

    describe("TodoItem update events", () => {

        let updateProducer$: Observable<TodoItem>;

        it("Example : Give update events ", () => {
            // GIVEN
            const todoProducer = '-a-';
            const consumer     = '-a-';
            givenEventProduced(todoProducer);
            givenStoredTodos([oneTodo(1, false)]);
            
            // WHEN
            whenSubscribe();
            
            // THEN
            expectUpdateEvents(consumer);
            expectStoredTodosToBe([oneTodo(1, true)]);
        });

        function givenEventProduced(producerMarbles: string) {
            const todoItemValues = {
                a: oneTodo(1, true)
            };
            
            updateProducer$ = testScheduler.createColdObservable(producerMarbles, todoItemValues);
        }

        function whenSubscribe() {
            localStorageTodoListService = new LocalStorageTodoListService();
            updateProducer$.subscribe(t => localStorageTodoListService.update(t));
            res$ = localStorageTodoListService.get();
        }

        function expectUpdateEvents(consumerMarbles: string) {
            const builder = new TodoItemEventBuilder().isUpdate();
            const todoItemConsumedValues = {
                a: builder.withItemTodo(oneTodo(1, true)).build()
            };
            testScheduler.expectObservable(res$).toBe(consumerMarbles, todoItemConsumedValues);
            testScheduler.flush();
        }
    });

    describe("TodoItem create events", () => {

        it("Example : Empty list create event generate a new id ", () => {
            // GIVEN
            givenEventProduced(1);
            givenStoredTodos([]);

            // WHEN
            whenSubscribe();

            // THEN
            expectCreateEventWithOneTodo(oneTodo(1));
            expectStoredTodosToBe([oneTodo(1)]);
        });

        it("Example : create event generates a new item with max id ", () => {
            // GIVEN
            givenEventProduced(2);
            givenStoredTodos([oneTodo(1)]);

            // WHEN
            whenSubscribe();

            // THEN
            expectCreateEventWithOneTodo(oneTodo(2));
            expectStoredTodosToBe([oneTodo(1), oneTodo(2)]);
        });

        function givenEventProduced(id: number) {
            const todoItemValues = {
                a: { title: "My item " + id } as CreateTodoItem
            };

            createProducer$ = testScheduler.createColdObservable('-a', todoItemValues);
        }

        function whenSubscribe() {
            localStorageTodoListService = new LocalStorageTodoListService();
            createProducer$.subscribe(t => localStorageTodoListService.create(t));
            res$ = localStorageTodoListService.get();
        }

        function expectCreateEventWithOneTodo(item: TodoItem) {
            const builder = new TodoItemEventBuilder();
            const createdItemValue = {
                a: builder.withItemTodo(item).build()
            }

            testScheduler.expectObservable(res$).toBe('-a', createdItemValue);
            testScheduler.flush();
        }

    });

    function givenStoredTodos(items: TodoItem[]) {
        localStorage.setItem("TODOS", JSON.stringify(items));
    }

    function expectStoredTodosToBe(items: TodoItem[]) {
        const stored = JSON.parse(localStorage.getItem("TODOS")!) as TodoItem[];
        expect(stored).toEqual(items);
    }
});