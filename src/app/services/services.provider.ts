import { makeEnvironmentProviders } from "@angular/core";
import { TodoListGateway, GetTodoItemEvents } from "../infra/todo-list/todo-list.gateway";
import { TodoListService } from "./todo-list.service";

export function servicesProvider() {
    return makeEnvironmentProviders([
        {
            provide: TodoListService,
            useFactory: (todoListGateway: TodoListGateway, getTodoItemEvents: GetTodoItemEvents) => {
              return new TodoListService(todoListGateway, getTodoItemEvents);
            }, 
            deps: [TodoListGateway, GetTodoItemEvents]
        }
    ]);
}