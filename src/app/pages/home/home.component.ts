import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Observable } from 'rxjs';
import { GetTodoListUsecase } from '../../usecases/get-todo-list/get-todo-list.usecase';
import { TodoListVM, TodoListViewModelType } from '../../usecases/get-todo-list/todo-list.vm';
import { DisplayListTodoComponent } from './components/display-list-todo/display-list-todo.component';
import { FilterOptionsComponent } from "./components/filter-options/filter-options.component";
import { CreateTodoComponent } from './components/create-todo/create-todo.component';

@Component({
    selector: 'home-root',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [MatToolbarModule, CommonModule, MatCardModule, DisplayListTodoComponent, FilterOptionsComponent, CreateTodoComponent]
})
export class HomeComponent implements OnInit {

  public todos$!: Observable<TodoListVM>;

  TodoListViewModelType = TodoListViewModelType;
  
  constructor(private getTodoList: GetTodoListUsecase) {}

  ngOnInit(): void {
    this.todos$ = this.getTodoList.run();
  }

}
