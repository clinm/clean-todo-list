import { Observable, map } from "rxjs";
import { TodoListBuilder } from "./todo-list.builder";
import { ItemVM, TodoListVM, TodoListViewModelType } from "./todo-list.vm";
import { TodoListGateway } from "../infra/todo-list.gateway";
import { TodoItem } from "../infra/todo-item.model";

export class GetTodoListUsecase {

    constructor(private todoListGateway: TodoListGateway){ }

    public run(): Observable<TodoListVM> {
        return this.todoListGateway
                    .getAll()
                    .pipe(map(todos => this.mapToVM(todos)));
    }

    private mapToVM(todos: TodoItem[]): TodoListVM {
        if (todos.length === 0) {
            return this.buildNoTask();
        } else {
            return this.buildWithTasks(todos);
        }
    }

    private buildNoTask(): TodoListVM {
        return new TodoListBuilder().withType(TodoListViewModelType.NoTodo).withMessage("Aucune tâche à effectuer").build();
    }

    private buildWithTasks(todos: TodoItem[]): TodoListVM {
        const items: ItemVM[] = todos.map(t => ({id: t.id, title: t.title, checked: t.checked}));

        return new TodoListBuilder()
                        .withType(TodoListViewModelType.Todos)
                        .withItems(items)
                        .build();
    }
}