import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { TodoListGateway } from "./infra/todo-list.gateway";

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { InMemoryTodoListService } from './infra/in-memory-todo-list.service';
import { GetTodoListUsecase } from './usecases/get-todo-list.usecase';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    {
      provide: TodoListGateway,
      useFactory: () => {
        const items = [{ id: 1, title: "Ma tâche", checked: false }, 
                       { id: 2, title: "Ma tâche complétée", checked: true}
                      ];

        return new InMemoryTodoListService(items, 3000);
      }
    }, {
      provide: GetTodoListUsecase,
      useFactory: (todoListGateway: TodoListGateway) => {
        return new GetTodoListUsecase(todoListGateway);
      }, 
      deps: [TodoListGateway]
    }
  ]
};
