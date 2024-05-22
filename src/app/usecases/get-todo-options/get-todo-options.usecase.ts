import { Observable, map } from "rxjs";
import { TodoOptionsGateway } from "../../infra/todo-options/todo-options.gateway";
import { TodoOptionVm } from "./todo-options.vm";
import { TodoOptions } from "../../infra/todo-options/todo-options.model";
import { TodoOptionsBuilder } from "./todo-options.builder";

export class GetTodoOptionsUsecase {

    public constructor(private todoOptionsGateway: TodoOptionsGateway) { }

    public run(): Observable<TodoOptionVm> {
        return this.todoOptionsGateway
                        .get()
                        .pipe(map(option => this.mapToVm(option)));
    }

    private mapToVm(option: TodoOptions): TodoOptionVm {
        return new TodoOptionsBuilder().withRemaining(option.remaining).build();
    }

}