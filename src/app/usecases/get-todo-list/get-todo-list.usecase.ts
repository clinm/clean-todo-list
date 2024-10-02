import { Observable, combineLatestWith, map } from "rxjs";
import { TodoItem } from "../../infra/todo-list/todo-item.model";
import { TodoOptionsGateway } from "../../infra/todo-options/todo-options.gateway";
import { TodoOptions } from "../../infra/todo-options/todo-options.model";
import { TodoListService } from "../../services/todo-list.service";
import { TodoListBuilder } from "./todo-list.builder";
import { ItemVM, TodoListVM, TodoListViewModelType } from "./todo-list.vm";

export class GetTodoListUsecase {

    constructor(private readonly todoListService: TodoListService,
                private readonly todoOptionsGateway: TodoOptionsGateway){ }

    public run(): Observable<TodoListVM> {
        return this.todoListService.get()
                    .pipe(
                        combineLatestWith(this.todoOptionsGateway.get()),
                        map(([todos, options]) => this.mapToVM(todos, options))
                    );
    }

    private mapToVM(todos: TodoItem[], options: TodoOptions): TodoListVM {
        const filteredTodos = this.filterTodos(todos, options);
        if (filteredTodos.length === 0) {
            return this.buildNoTask();
        } else {
            return this.buildWithTasks(filteredTodos);
        }
    }

    private buildNoTask(): TodoListVM {
        return new TodoListBuilder().withType(TodoListViewModelType.NoTodo).withMessage("Aucune tâche à effectuer").build();
    }

    private filterTodos(todos: TodoItem[], options: TodoOptions): TodoItem[] {
        return todos.filter(t => !options.remaining || !t.checked);
    }

    private buildWithTasks(todos: TodoItem[]): TodoListVM {
        const items: ItemVM[] = todos.map(t => ({id: t.id, title: t.title, checked: t.checked}));

        return new TodoListBuilder()
                        .withType(TodoListViewModelType.Todos)
                        .withItems(items)
                        .build();
    }
}