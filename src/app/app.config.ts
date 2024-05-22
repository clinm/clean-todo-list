import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { TodoListGateway } from "./infra/todo-list/todo-list.gateway";

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { InMemoryTodoListService } from './infra/todo-list/in-memory-todo-list.service';
import { GetTodoListUsecase } from './usecases/get-todo-list/get-todo-list.usecase';
import { TodoOptionsGateway } from './infra/todo-options/todo-options.gateway';
import { ALL_ITEM_OPTIONS } from './infra/todo-options/todo-options.fixture';
import { InMemoryTodoOptionsService } from './infra/todo-options/in-memory-todo-options.service';
import { GetTodoOptionsUsecase } from './usecases/get-todo-options/get-todo-options.usecase';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    {
      provide: TodoOptionsGateway,
      useFactory: () => {
        return new InMemoryTodoOptionsService(ALL_ITEM_OPTIONS);
      }
    },{
      provide: TodoListGateway,
      useFactory: () => {
        const items = [{ id: 1, title: "Ma tâche", checked: false }, 
                       { id: 2, title: "Ma tâche complétée", checked: true}
                      ];

        return new InMemoryTodoListService(items, 3000);
      }
    }, {
      provide: GetTodoListUsecase,
      useFactory: (todoListGateway: TodoListGateway, todoOptionGateway: TodoOptionsGateway) => {
        return new GetTodoListUsecase(todoListGateway, todoOptionGateway);
      }, 
      deps: [TodoListGateway, TodoOptionsGateway]
    }, {
      provide: GetTodoOptionsUsecase,
      useFactory: (todoOptionGateway: TodoOptionsGateway) => {
        return new GetTodoOptionsUsecase(todoOptionGateway);
      }, 
      deps: [TodoOptionsGateway]
    }
  ]
};
