import { InMemoryTodoListService } from "../infra/in-memory-todo-list.service";
import { TodoItem } from "../infra/todo-item.model";
import { GetTodoListUsecase } from "./get-todo-list.usecase";
import { TodoListVM, TodoListViewModelType } from "./todo-list.vm";

describe("Feature : Display todo list", () => {

    it("Example : No todos", (done) => {
        // GIVEN
        const todoListGateway = new InMemoryTodoListService([]);
        const getTodoListUsecase = new GetTodoListUsecase(todoListGateway);

        // WHEN
        const res$ = getTodoListUsecase.run();

        // THEN
        res$.subscribe(list => {
            expect(list).toEqual(expectNoTodo());
            done();
        })
    });

    it("Example : Todo with two items", (done) => {
        // GIVEN
        const todoListGateway = new InMemoryTodoListService([oneTodo(1), oneTodo(2)]);
        const getTodoListUsecase = new GetTodoListUsecase(todoListGateway);

        // WHEN
        const res$ = getTodoListUsecase.run();

        // THEN
        res$.subscribe(list => {
            expect(list).toEqual(expectTodoWithTwoItems());
            done();
        })
    });

    function oneTodo(id: number, checked: boolean = false): TodoItem {
        return {id: id, title: "My item " + id, checked: checked};
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

