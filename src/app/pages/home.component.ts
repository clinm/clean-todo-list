import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Observable } from 'rxjs';
import { GetTodoListUsecase } from '../usecases/get-todo-list.usecase';
import { TodoListVM, TodoListViewModelType } from '../usecases/todo-list.vm';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatListModule} from '@angular/material/list';

@Component({
  selector: 'home-root',
  standalone: true,
  imports: [MatToolbarModule, CommonModule, MatCardModule, MatCheckboxModule, MatListModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  public todos$!: Observable<TodoListVM>;

  TodoListViewModelType = TodoListViewModelType;

  constructor(private getTodoList: GetTodoListUsecase) {}

  ngOnInit(): void {
    this.todos$ = this.getTodoList.run();
  }
}
