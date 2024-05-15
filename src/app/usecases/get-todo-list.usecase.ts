import { Observable, catchError, map, of, startWith } from "rxjs";
import { TodoItem } from "../infra/todo-item.model";
import { TodoListGateway } from "../infra/todo-list.gateway";
import { TodoListBuilder } from "./todo-list.builder";
import { ItemVM, TodoListVM, TodoListViewModelType } from "./todo-list.vm";

export class GetTodoListUsecase {

    constructor(private todoListGateway: TodoListGateway){ }

    public run({ remaining = true }: { remaining?: boolean} = {}): Observable<TodoListVM> {
        return this.todoListGateway
                    .getAll()
                    .pipe(
                        map(todos => this.mapToVM(todos, remaining)),
                        startWith(this.buildLoading()),
                        catchError(() => of(this.buildError()))
                    );
    }

    private mapToVM(todos: TodoItem[], remaining: boolean): TodoListVM {
        if (todos.length === 0) {
            return this.buildNoTask();
        } else {
            return this.buildWithTasks(todos, remaining);
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

    private buildWithTasks(todos: TodoItem[], remaining: boolean): TodoListVM {
        const items: ItemVM[] = todos.filter(t => !remaining || !t.checked)
                                    .map(t => ({id: t.id, title: t.title, checked: t.checked}));

        return new TodoListBuilder()
                        .withType(TodoListViewModelType.Todos)
                        .withItems(items)
                        .build();
    }
}