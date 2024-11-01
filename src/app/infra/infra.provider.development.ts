import { infraRootProvider } from "./infra.provider";
import { InMemoryTodoListService } from "./todo-list/in-memory-todo-list.service";
import { InMemoryTodoOptionsService } from "./todo-options/in-memory-todo-options.service";
import { ALL_ITEM_OPTIONS } from "./todo-options/todo-options.fixture";

export function infraProviders() {
    const todoOptionsService = new InMemoryTodoOptionsService(ALL_ITEM_OPTIONS);
    const items = [
        { id: 1, title: "Ma tâche", checked: false }, 
        { id: 2, title: "Ma tâche complétée", checked: true}
    ];
    const todoListService = new InMemoryTodoListService(items);

    return infraRootProvider(todoListService, todoOptionsService);
}