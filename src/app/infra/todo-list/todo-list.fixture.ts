import { Observable, Subject } from "rxjs";
import { TodoItem } from "./todo-item.model";
import { GetTodoItemEvents, TodoListGateway } from "./todo-list.gateway";

export function oneTodo(id: number, checked: boolean = false): TodoItem {
        return {id: id, title: "My item " + id, checked: checked};
}

export class DummyGetTodoItemEvents implements GetTodoItemEvents {
        
        private todoItem$ = new Subject<TodoItem>();

        get(): Observable<TodoItem> {
                return this.todoItem$.asObservable(); 
        }
}

export class DummyTodoListService implements TodoListGateway {

        constructor(private todos$: Observable<TodoItem[]>) {}
    
        getAll(): Observable<TodoItem[]> {
            return this.todos$;
        }    
}