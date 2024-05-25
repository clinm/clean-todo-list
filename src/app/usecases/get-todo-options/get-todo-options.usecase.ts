import { Observable, map, shareReplay } from "rxjs";
import { TodoOptionsGateway } from "../../infra/todo-options/todo-options.gateway";
import { TodoOptionVm } from "./todo-options.vm";
import { TodoOptions } from "../../infra/todo-options/todo-options.model";
import { TodoOptionsBuilder } from "./todo-options.builder";

export class GetTodoOptionsUsecase {

    private todoOptionVm$!: Observable<TodoOptionVm>;

    public constructor(private todoOptionsGateway: TodoOptionsGateway) { }


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
                        map(option => this.mapToVm(option)),
                        shareReplay(1)
                    );  
    }

    private mapToVm(option: TodoOptions): TodoOptionVm {
        return new TodoOptionsBuilder().withRemaining(option.remaining).build();
    }

}