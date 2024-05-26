import { TestScheduler } from 'rxjs/testing';
import { Observable, throwError } from 'rxjs';
import { InMemoryTodoListService } from "../../infra/todo-list/in-memory-todo-list.service";
import { TodoItem } from "../../infra/todo-list/todo-item.model";
import { GetTodoListUsecase } from "./get-todo-list.usecase";
import { TodoListVM, TodoListViewModelType } from "./todo-list.vm";
import { TodoListGateway } from '../../infra/todo-list/todo-list.gateway';
import { oneTodo } from '../../infra/todo-list/todo-list.fixture';
import { InMemoryTodoOptionsService } from '../../infra/todo-options/in-memory-todo-options.service';
import { ALL_ITEM_OPTIONS, REMAINING_ITEM_OPTIONS } from '../../infra/todo-options/todo-options.fixture';

describe("Feature : Display todo list", () => {

    let testScheduler: TestScheduler;

    beforeEach(() => {
        testScheduler = new TestScheduler((actual, expected) => {
            return expect(actual).toEqual(expected);
        });
    });

    it("Example : No todos", () => {
        // GIVEN
        const todoListGateway = new InMemoryTodoListService([]);
        const todoOptionGateway = new InMemoryTodoOptionsService(REMAINING_ITEM_OPTIONS);
        const getTodoListUsecase = new GetTodoListUsecase(todoListGateway, todoOptionGateway);

        // WHEN
        const res$ = getTodoListUsecase.run();

        // THEN
        thenExpectValue(res$, expectNoTodo());
    });

    it("Example : Todo with two items", () => {
        // GIVEN
        const todoListGateway = new InMemoryTodoListService([oneTodo(1), oneTodo(2)]);
        const todoOptionGateway = new InMemoryTodoOptionsService(REMAINING_ITEM_OPTIONS);
        const getTodoListUsecase = new GetTodoListUsecase(todoListGateway, todoOptionGateway);

        // WHEN
        const res$ = getTodoListUsecase.run();

        // THEN
        thenExpectValue(res$, expectTodoWithTwoItems());
    });

    it("Example : Todo with only 'todo' items", () => {
        // GIVEN
        const todoListGateway = new InMemoryTodoListService([oneTodo(1), oneTodo(2), oneTodo(3, true)]);
        const todoOptionGateway = new InMemoryTodoOptionsService(REMAINING_ITEM_OPTIONS);
        const getTodoListUsecase = new GetTodoListUsecase(todoListGateway, todoOptionGateway);

        // WHEN
        const res$ = getTodoListUsecase.run();

        // THEN
        thenExpectValue(res$, expectTodoWithTwoItems());
    });

    it("Example : Todo with 'completed' items", () => {
        // GIVEN
        const todoListGateway = new InMemoryTodoListService([oneTodo(1), oneTodo(2), oneTodo(3, true)]);
        const todoOptionGateway = new InMemoryTodoOptionsService(ALL_ITEM_OPTIONS);
        const getTodoListUsecase = new GetTodoListUsecase(todoListGateway, todoOptionGateway);

        // WHEN
        const res$ = getTodoListUsecase.run();

        // THEN
        thenExpectValue(res$, expectTodoWithThreeItems());
    });

    xit("Example : Error while loading todos", () => {
        // GIVEN
        const todoListGateway = new ErrorTodoListGateway();
        const todoOptionGateway = new InMemoryTodoOptionsService(REMAINING_ITEM_OPTIONS);
        const getTodoListUsecase = new GetTodoListUsecase(todoListGateway, todoOptionGateway);

        // WHEN
        const res$ = getTodoListUsecase.run();

        // THEN
        thenExpectValue(res$, expectError());
    });

    function thenExpectValue(res$: Observable<TodoListVM>, value: TodoListVM) {
        const expectedMarbles = '(a-b';
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

    function expectTodoWithTwoItems(): TodoListVM {
        const items = [ {id: 1, title: "My item 1", checked: false}, 
                        {id: 2, title: "My item 2", checked: false}
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

    class ErrorTodoListGateway implements TodoListGateway {
        
        getAll(): Observable<TodoItem[]> {
            return throwError(() => new Error('Error'));
        }
    }
});

