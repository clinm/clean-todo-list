import { InMemoryTodoListService } from "../infra/in-memory-todo-list.service";
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

    function expectNoTodo(): TodoListVM {
        return { type: TodoListViewModelType.NoTodo, message: "Aucune tâche à effectuer" };
    }
});

