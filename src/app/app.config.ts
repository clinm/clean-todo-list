import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { GetTodoItemEvents, TodoListGateway, UpdateTodoItemGateway } from "./infra/todo-list/todo-list.gateway";

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { InMemoryTodoListService } from './infra/todo-list/in-memory-todo-list.service';
import { GetTodoListUsecase } from './usecases/get-todo-list/get-todo-list.usecase';
import { TodoOptionsGateway, UpdateTodoOptionsGateway } from './infra/todo-options/todo-options.gateway';
import { ALL_ITEM_OPTIONS } from './infra/todo-options/todo-options.fixture';
import { InMemoryTodoOptionsService } from './infra/todo-options/in-memory-todo-options.service';
import { GetTodoOptionsUsecase } from './usecases/get-todo-options/get-todo-options.usecase';
import { TodoListService } from './services/todo-list.service';

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
      provide: UpdateTodoOptionsGateway,
      useFactory: (todoOptionGateway: TodoOptionsGateway) => {
        return todoOptionGateway;
      }, 
      deps: [TodoOptionsGateway]
    },{
      provide: TodoListGateway,
      useFactory: () => {
        const items = [{ id: 1, title: "Ma tâche", checked: false }, 
                       { id: 2, title: "Ma tâche complétée", checked: true}
                      ];

        return new InMemoryTodoListService(items, 3000);
      }
    },{
      provide: UpdateTodoItemGateway,
      useFactory: (todoListGateway: TodoListGateway) => {
        return todoListGateway;
      },
      deps: [TodoListGateway]
    },{
      provide: GetTodoItemEvents,
      useFactory: (todoListGateway: TodoListGateway) => {
        return todoListGateway;
      },
      deps: [TodoListGateway]
    },{
      provide: TodoListService,
      useFactory: (todoListGateway: TodoListGateway, getTodoItemEvents: GetTodoItemEvents) => {
        return new TodoListService(todoListGateway, getTodoItemEvents);
      }, 
      deps: [TodoListGateway, GetTodoItemEvents]
    }, {
      provide: GetTodoListUsecase,
      useFactory: (todoListService: TodoListService, todoOptionGateway: TodoOptionsGateway) => {
        return new GetTodoListUsecase(todoListService, todoOptionGateway);
      }, 
      deps: [TodoListService, TodoOptionsGateway]
    }, {
      provide: GetTodoOptionsUsecase,
      useFactory: (todoOptionGateway: TodoOptionsGateway) => {
        return new GetTodoOptionsUsecase(todoOptionGateway);
      }, 
      deps: [TodoOptionsGateway]
    }
  ]
};
