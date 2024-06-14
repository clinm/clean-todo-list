import { makeEnvironmentProviders } from "@angular/core";
import { GetTodoListUsecase } from "./get-todo-list/get-todo-list.usecase";
import { TodoOptionsGateway } from "../infra/todo-options/todo-options.gateway";
import { TodoListService } from "../services/todo-list.service";
import { GetTodoOptionsUsecase } from "./get-todo-options/get-todo-options.usecase";

export function usecasesProviders() {
    return makeEnvironmentProviders([
        {
            provide: GetTodoListUsecase,
            useFactory: (todoListService: TodoListService, todoOptionGateway: TodoOptionsGateway) => {
              return new GetTodoListUsecase(todoListService, todoOptionGateway);
            }, 
            deps: [TodoListService, TodoOptionsGateway]
        }, {
            provide: GetTodoOptionsUsecase,
            useFactory: (todoListService: TodoListService, todoOptionGateway: TodoOptionsGateway) => {
              return new GetTodoOptionsUsecase(todoOptionGateway, todoListService);
            }, 
            deps: [TodoListService, TodoOptionsGateway]
        }
    ]);
}