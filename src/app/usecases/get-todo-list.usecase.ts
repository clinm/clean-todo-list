import { Observable, map, of } from "rxjs";
import { TodoListBuilder } from "./todo-list.builder";
import { TodoListVM, TodoListViewModelType } from "./todo-list.vm";
import { TodoListGateway } from "../infra/todo-list.gateway";

export class GetTodoListUsecase {

    constructor(private todoListGateway: TodoListGateway){ }

    public run(): Observable<TodoListVM> {
        return this.todoListGateway
                    .getAll()
                    .pipe(map((todos) => {
                        return this.buildNoTask();
                    }))
    }

    private buildNoTask(): TodoListVM {
        return new TodoListBuilder().withType(TodoListViewModelType.NoTodo).withMessage("Aucune tâche à effectuer").build();
    }
}