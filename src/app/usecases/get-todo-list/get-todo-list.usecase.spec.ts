import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { TodoItem } from "../../infra/todo-list/todo-item.model";
import { oneTodo } from '../../infra/todo-list/todo-list.fixture';
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
        const todoListGateway = new SchedulerTodoListGateway([]);
        const todoOptionGateway = new InMemoryTodoOptionsService(REMAINING_ITEM_OPTIONS);
        const getTodoListUsecase = createUsecase(todoListGateway, todoOptionGateway);

        // WHEN
        const res$ = getTodoListUsecase.run();

        // THEN
        thenExpectValue(res$, expectNoTodo());
    });

    it("Example : Todo with two items", () => {
        // GIVEN
        const todoListGateway = new SchedulerTodoListGateway([oneTodo(1), oneTodo(2)]);
        const todoOptionGateway = new InMemoryTodoOptionsService(REMAINING_ITEM_OPTIONS);
        const getTodoListUsecase = createUsecase(todoListGateway, todoOptionGateway);

        // WHEN
        const res$ = getTodoListUsecase.run();

        // THEN
        thenExpectValue(res$, expectTodoWithTwoItems());
    });

    it("Example : Todo with only 'todo' items", () => {
        // GIVEN
        const todoListGateway = new SchedulerTodoListGateway([oneTodo(1), oneTodo(2), oneTodo(3, true)]);
        const todoOptionGateway = new InMemoryTodoOptionsService(REMAINING_ITEM_OPTIONS);
        const getTodoListUsecase = createUsecase(todoListGateway, todoOptionGateway);

        // WHEN
        const res$ = getTodoListUsecase.run();

        // THEN
        thenExpectValue(res$, expectTodoWithTwoItems());
    });

    it("Example : Todo with 'completed' items", () => {
        // GIVEN
        const todoListGateway = new SchedulerTodoListGateway([oneTodo(1), oneTodo(2), oneTodo(3, true)]);
        const todoOptionGateway = new InMemoryTodoOptionsService(ALL_ITEM_OPTIONS);
        const getTodoListUsecase = createUsecase(todoListGateway, todoOptionGateway);

        // WHEN
        const res$ = getTodoListUsecase.run();

        // THEN
        thenExpectValue(res$, expectTodoWithThreeItems());
    });

    xit("Example : Error while loading todos", () => {
        // GIVEN
        const todoListGateway = new SchedulerErrorTodoListGateway("Unknown error");
        const todoOptionGateway = new InMemoryTodoOptionsService(REMAINING_ITEM_OPTIONS);
        const getTodoListUsecase = createUsecase(todoListGateway, todoOptionGateway);

        // WHEN
        const res$ = getTodoListUsecase.run();

        // THEN
        thenExpectValue(res$, expectError());
    });

    it("Example : event on todo update item action", () => {
        // GIVEN
        const updateEvents    = '-----a-b-';
        const expectedMarbles = 'ab---c-d-';
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

        const todoListGateway = new SchedulerTodoListGateway([oneTodo(1), oneTodo(2)]);
        const todoOptionGateway = new InMemoryTodoOptionsService(ALL_ITEM_OPTIONS);
        const getTodoItemEvents = new SchedulerGetTodoItemEvents(updateEvents, updateValues);
        const getTodoListUsecase = createUsecase(todoListGateway, todoOptionGateway, getTodoItemEvents);


        // WHEN
        const res$ = getTodoListUsecase.run();

        // THEN
        testScheduler.expectObservable(res$).toBe(expectedMarbles, expectedValues);
        testScheduler.flush();
    });

    function thenExpectValue(res$: Observable<TodoListVM>, value: TodoListVM) {
        const expectedMarbles = 'ab--';
        const expectedValues = {
            a: expectLoading(),
            b: value,
        };

        testScheduler.expectObservable(res$).toBe(expectedMarbles, expectedValues);
        testScheduler.flush();
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
                            getTodoItemEvents: GetTodoItemEvents = new SchedulerGetTodoItemEvents('-')) {
        const todoListService = new TodoListService(todoListGateway, getTodoItemEvents);
        return new GetTodoListUsecase(todoListService, todoOptionGateway);
    }

    class SchedulerTodoListGateway implements TodoListGateway {

        constructor(private values: TodoItem[]) { }

        getAll(): Observable<TodoItem[]> {
            return testScheduler.createColdObservable('-a', { a: this.values});
        }
    }

    class SchedulerErrorTodoListGateway implements TodoListGateway {
        constructor(private value: any) { }

        getAll(): Observable<TodoItem[]> {
            return testScheduler.createColdObservable('--#', undefined, this.value);
        }
    }

    class SchedulerGetTodoItemEvents implements GetTodoItemEvents {

        constructor(private events: string, private values?: any) { }

        get(): Observable<TodoItem> {
            return testScheduler.createColdObservable(this.events, this.values);
        }
        
    }
});


