import { makeEnvironmentProviders } from "@angular/core";
import { LocalStorageTodoListService } from "./todo-list/local-storage-todo-list.service";
import { CreateTodoItemGateway, GetTodoItemEvents, TodoListGateway, UpdateTodoItemGateway } from "./todo-list/todo-list.gateway";
import { InMemoryTodoOptionsService } from "./todo-options/in-memory-todo-options.service";
import { ALL_ITEM_OPTIONS } from "./todo-options/todo-options.fixture";
import { TodoOptionsGateway, UpdateTodoOptionsGateway } from "./todo-options/todo-options.gateway";

export function infraProviders() {
    const todoOptionsService = new InMemoryTodoOptionsService(ALL_ITEM_OPTIONS);
    const todoListService = new LocalStorageTodoListService();

    return infraRootProvider(todoListService, todoOptionsService);
}

export function infraRootProvider(todoListGateway: TodoListGateway & UpdateTodoItemGateway & GetTodoItemEvents & CreateTodoItemGateway,
                                optionGateway: InMemoryTodoOptionsService) {
    return makeEnvironmentProviders([
        { provide: TodoListGateway, useValue: todoListGateway},
        { provide: TodoOptionsGateway, useValue: optionGateway},
        { provide: UpdateTodoOptionsGateway, useValue: optionGateway},
        { provide: UpdateTodoItemGateway, useValue: todoListGateway},
        { provide: GetTodoItemEvents, useValue: todoListGateway},
        { provide: CreateTodoItemGateway, useValue: todoListGateway},
    ]);
}