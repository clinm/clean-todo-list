import { TestScheduler } from 'rxjs/testing';
import { Observable } from 'rxjs';
import { InMemoryTodoListService } from "../infra/in-memory-todo-list.service";
import { TodoItem } from "../infra/todo-item.model";
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
        const todoListGateway = new InMemoryTodoListService([]);
        const getTodoListUsecase = new GetTodoListUsecase(todoListGateway);

        // WHEN
        const res$ = getTodoListUsecase.run();

        // THEN
        thenExpectValue(res$, expectNoTodo());
    });

    it("Example : Todo with two items", () => {
        // GIVEN
        const todoListGateway = new InMemoryTodoListService([oneTodo(1), oneTodo(2)]);
        const getTodoListUsecase = new GetTodoListUsecase(todoListGateway);

        // WHEN
        const res$ = getTodoListUsecase.run();

        // THEN
        thenExpectValue(res$, expectTodoWithTwoItems());
    });

    it("Example : Todo with only 'todo' items", () => {
        // GIVEN
        const todoListGateway = new InMemoryTodoListService([oneTodo(1), oneTodo(2), oneTodo(3, true)]);
        const getTodoListUsecase = new GetTodoListUsecase(todoListGateway);

        // WHEN
        const res$ = getTodoListUsecase.run();

        // THEN
        thenExpectValue(res$, expectTodoWithTwoItems());
    });

    function thenExpectValue(res$: Observable<TodoListVM>, value: TodoListVM) {
        const expectedMarbles = '(a-b|)';
        const expectedValues = {
            a: expectLoading(),
            b: value,
        };
        testScheduler.run(( { expectObservable }) => {
            expectObservable(res$).toBe(expectedMarbles, expectedValues);
        });
    }

    function oneTodo(id: number, checked: boolean = false): TodoItem {
        return {id: id, title: "My item " + id, checked: checked};
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
});

