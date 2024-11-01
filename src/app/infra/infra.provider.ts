import { makeEnvironmentProviders } from "@angular/core";
import { InMemoryTodoListService } from "./todo-list/in-memory-todo-list.service";
import { CreateTodoItemGateway, GetTodoItemEvents, TodoListGateway, UpdateTodoItemGateway } from "./todo-list/todo-list.gateway";
import { InMemoryTodoOptionsService } from "./todo-options/in-memory-todo-options.service";
import { ALL_ITEM_OPTIONS } from "./todo-options/todo-options.fixture";
import { TodoOptionsGateway, UpdateTodoOptionsGateway } from "./todo-options/todo-options.gateway";

export function infraProviders() {
    const todoOptionsService = new InMemoryTodoOptionsService(ALL_ITEM_OPTIONS);
    const todoListService = new InMemoryTodoListService([]);

    return infraRootProvider(todoListService, todoOptionsService);
}

export function infraRootProvider(todoListGateway: InMemoryTodoListService, optionGateway: InMemoryTodoOptionsService) {
    return makeEnvironmentProviders([
        { provide: TodoListGateway, useValue: todoListGateway},
        { provide: TodoOptionsGateway, useValue: optionGateway},
        { provide: UpdateTodoOptionsGateway, useValue: optionGateway},
        { provide: UpdateTodoItemGateway, useValue: todoListGateway},
        { provide: GetTodoItemEvents, useValue: todoListGateway},
        { provide: CreateTodoItemGateway, useValue: todoListGateway},
    ]);
}