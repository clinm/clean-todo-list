import { Observable, catchError, forkJoin, map, of, startWith } from "rxjs";
import { TodoItem } from "../../infra/todo-list/todo-item.model";
import { TodoListGateway } from "../../infra/todo-list/todo-list.gateway";
import { TodoListBuilder } from "./todo-list.builder";
import { ItemVM, TodoListVM, TodoListViewModelType } from "./todo-list.vm";
import { TodoOptionsGateway } from "../../infra/todo-options/todo-options.gateway";
import { TodoOptions } from "../../infra/todo-options/todo-options.model";

export class GetTodoListUsecase {

    constructor(private todoListGateway: TodoListGateway,
                private todoOptionsGateway: TodoOptionsGateway){ }

    public run(): Observable<TodoListVM> {
        return forkJoin([this.todoListGateway.getAll(), this.todoOptionsGateway.get()])
                    .pipe(
                        map(([todos, options]) => this.mapToVM(todos, options)),
                        startWith(this.buildLoading()),
                        catchError(() => of(this.buildError()))
                    );
    }

    private mapToVM(todos: TodoItem[], options: TodoOptions): TodoListVM {
        if (todos.length === 0) {
            return this.buildNoTask();
        } else {
            return this.buildWithTasks(todos, options);
        }
    }

    private buildError(): TodoListVM {
        return new TodoListBuilder().withType(TodoListViewModelType.Error).withMessage("Une erreur est survenue").build();
    }

    private buildLoading(): TodoListVM {
        return new TodoListBuilder().withType(TodoListViewModelType.Loading).withMessage("Chargement en cours ...").build();
    }

    private buildNoTask(): TodoListVM {
        return new TodoListBuilder().withType(TodoListViewModelType.NoTodo).withMessage("Aucune tâche à effectuer").build();
    }

    private buildWithTasks(todos: TodoItem[], options: TodoOptions): TodoListVM {
        const items: ItemVM[] = todos.filter(t => !options.remaining || !t.checked)
                                    .map(t => ({id: t.id, title: t.title, checked: t.checked}));

        return new TodoListBuilder()
                        .withType(TodoListViewModelType.Todos)
                        .withItems(items)
                        .build();
    }
}