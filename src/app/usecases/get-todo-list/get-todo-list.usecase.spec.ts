import { Observable, throwError } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { TodoItem } from "../../infra/todo-list/todo-item.model";
import { DummyTodoListService, oneTodo } from '../../infra/todo-list/todo-list.fixture';
import { GetTodoItemEvents, TodoListGateway } from '../../infra/todo-list/todo-list.gateway';
import { InMemoryTodoOptionsService } from '../../infra/todo-options/in-memory-todo-options.service';
import { ALL_ITEM_OPTIONS, REMAINING_ITEM_OPTIONS } from '../../infra/todo-options/todo-options.fixture';
import { TodoOptionsGateway } from '../../infra/todo-options/todo-options.gateway';
import { TodoListService } from '../../services/todo-list.service';
import { GetTodoListUsecase } from "./get-todo-list.usecase";
import { TodoListVM, TodoListViewModelType } from "./todo-list.vm";

describe("Feature : Display todo list", () => {

    let testScheduler: TestScheduler;

    beforeEach(() => {
        testScheduler = new TestScheduler((actual, expected) => {
            return expect(actual).toEqual(expected);
        });
    });

    it("Example : No todos", () => {
        // GIVEN
        const todoListGateway = createDummyTodoListService([]);
        const todoOptionGateway = new InMemoryTodoOptionsService(REMAINING_ITEM_OPTIONS);
        const getTodoListUsecase = createUsecase(todoListGateway, todoOptionGateway);

        // WHEN
        const res$ = getTodoListUsecase.run();

        // THEN
        thenExpectValue(res$, expectNoTodo());
    });

    it("Example : Todo with two items", () => {
        // GIVEN
        const todoListGateway = createDummyTodoListService([oneTodo(1), oneTodo(2)]);
        const todoOptionGateway = new InMemoryTodoOptionsService(REMAINING_ITEM_OPTIONS);
        const getTodoListUsecase = createUsecase(todoListGateway, todoOptionGateway);

        // WHEN
        const res$ = getTodoListUsecase.run();

        // THEN
        thenExpectValue(res$, expectTodoWithTwoItems());
    });

    it("Example : Todo with only 'todo' items", () => {
        // GIVEN
        const todoListGateway = createDummyTodoListService([oneTodo(1), oneTodo(2), oneTodo(3, true)]);
        const todoOptionGateway = new InMemoryTodoOptionsService(REMAINING_ITEM_OPTIONS);
        const getTodoListUsecase = createUsecase(todoListGateway, todoOptionGateway);

        // WHEN
        const res$ = getTodoListUsecase.run();

        // THEN
        thenExpectValue(res$, expectTodoWithTwoItems());
    });

    it("Example : Todo with 'completed' items", () => {
        // GIVEN
        const todoListGateway = createDummyTodoListService([oneTodo(1), oneTodo(2), oneTodo(3, true)]);
        const todoOptionGateway = new InMemoryTodoOptionsService(ALL_ITEM_OPTIONS);
        const getTodoListUsecase = createUsecase(todoListGateway, todoOptionGateway);

        // WHEN
        const res$ = getTodoListUsecase.run();

        // THEN
        thenExpectValue(res$, expectTodoWithThreeItems());
    });

    xit("Example : Error while loading todos", () => {
        // GIVEN
        const todoListGateway = new ErrorTodoListGateway();
        const todoOptionGateway = new InMemoryTodoOptionsService(REMAINING_ITEM_OPTIONS);
        const getTodoListUsecase = createUsecase(todoListGateway, todoOptionGateway);

        // WHEN
        const res$ = getTodoListUsecase.run();

        // THEN
        thenExpectValue(res$, expectError());
    });

    it("Example : event on todo update item action", () => {
        // GIVEN
        testScheduler.run((helpers) => {
            const { cold, expectObservable } = helpers;

            const updateEvents    = '-----a-b-';
            const expectedMarbles = '(ab)-c-d-';
            const updateValues = {
                a: {id: 1, title: "My item 1", checked: true},
                b: {id: 2, title: "My item 2", checked: true}
            }
            const expectedValues = {
                a: expectLoading(),
                b: expectTodoWithTwoItems(false, false),
                c: expectTodoWithTwoItems(true, false),
                d: expectTodoWithTwoItems(true, true)
            };

            const todoListGateway = createDummyTodoListService([oneTodo(1), oneTodo(2)]);
            const todoOptionGateway = new InMemoryTodoOptionsService(ALL_ITEM_OPTIONS);
            const getTodoItemEvents = new SchedulerGetTodoItemEvents(cold(updateEvents, updateValues));
            const getTodoListUsecase = createUsecase(todoListGateway, todoOptionGateway, getTodoItemEvents);


            // WHEN
            const res$ = getTodoListUsecase.run();
    
            // THEN
            expectObservable(res$).toBe(expectedMarbles, expectedValues);
        });
    });

    function thenExpectValue(res$: Observable<TodoListVM>, value: TodoListVM) {
        const expectedMarbles = '(ab)--';
        const expectedValues = {
            a: expectLoading(),
            b: value,
        };
        testScheduler.run(( { expectObservable }) => {
            expectObservable(res$).toBe(expectedMarbles, expectedValues);
        });
    }

    function expectLoading(): TodoListVM {
        return { type: TodoListViewModelType.Loading, message: "Chargement en cours ..." };
    }

    function expectNoTodo(): TodoListVM {
        return { type: TodoListViewModelType.NoTodo, message: "Aucune tâche à effectuer" };
    }

    function expectTodoWithTwoItems(checked1: boolean = false, checked2: boolean = false): TodoListVM {
        const items = [ {id: 1, title: "My item 1", checked: checked1}, 
                        {id: 2, title: "My item 2", checked: checked2}
                    ];
        return { type: TodoListViewModelType.Todos, items: items };
    }

    function expectTodoWithThreeItems(): TodoListVM {
        const items = [ {id: 1, title: "My item 1", checked: false}, 
                        {id: 2, title: "My item 2", checked: false},
                        {id: 3, title: "My item 3", checked: true}
                    ];
        return { type: TodoListViewModelType.Todos, items: items };
    }

    function expectError(): TodoListVM {
        return { type: TodoListViewModelType.Error, message: "Une erreur est survenue" };
    }
    
    function createUsecase(todoListGateway: TodoListGateway,
                            todoOptionGateway: TodoOptionsGateway,
                            getTodoItemEvents: GetTodoItemEvents = new SchedulerGetTodoItemEvents(testScheduler.createColdObservable('-'))) {
        const todoListService = new TodoListService(todoListGateway, getTodoItemEvents);
        return new GetTodoListUsecase(todoListService, todoOptionGateway);
    }

    function createDummyTodoListService(todos: TodoItem[]): DummyTodoListService {
        return new DummyTodoListService(testScheduler.createColdObservable('a', {a: todos}));
    }
    class ErrorTodoListGateway implements TodoListGateway {
        
        getAll(): Observable<TodoItem[]> {
            return throwError(() => new Error('Error'));
        }
    }

    class SchedulerGetTodoItemEvents implements GetTodoItemEvents {

        constructor(private events: Observable<TodoItem>) { }

        get(): Observable<TodoItem> {
            return this.events;
        }
        
    }
});


