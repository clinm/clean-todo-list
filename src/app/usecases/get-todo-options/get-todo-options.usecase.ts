import { Observable, combineLatestWith, map, shareReplay } from "rxjs";
import { TodoItem } from "../../infra/todo-list/todo-item.model";
import { TodoOptionsGateway } from "../../infra/todo-options/todo-options.gateway";
import { TodoOptions } from "../../infra/todo-options/todo-options.model";
import { TodoListService } from "../../services/todo-list.service";
import { TodoOptionsBuilder } from "./todo-options.builder";
import { TodoOptionVm } from "./todo-options.vm";

export class GetTodoOptionsUsecase {

    private todoOptionVm$!: Observable<TodoOptionVm>;

    public constructor(private readonly todoOptionsGateway: TodoOptionsGateway,
                      private readonly todoListService: TodoListService) { }


    public run(): Observable<TodoOptionVm> {
        if (!this.todoOptionVm$) {
            this.todoOptionVm$ = this.init();
        }
        
        return this.todoOptionVm$;
        
    }

    private init(): Observable<TodoOptionVm> {
        return this.todoOptionsGateway
                    .get()
                    .pipe(
                        combineLatestWith(this.todoListService.get()),
                        map(([option, todos]) => this.mapToVm(option, todos)),
                        shareReplay(1)
                    );  
    }

    private mapToVm(option: TodoOptions, todos: TodoItem[]): TodoOptionVm {
        const remaining = todos.filter(i => !i.checked).length;
        return new TodoOptionsBuilder()
                        .withRemaining(option.remaining)
                        .withCounters(remaining, todos.length)
                        .build();
    }

}