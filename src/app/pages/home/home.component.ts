import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Observable } from 'rxjs';
import { UpdateTodoOptionsGateway } from '../../infra/todo-options/todo-options.gateway';
import { GetTodoListUsecase } from '../../usecases/get-todo-list/get-todo-list.usecase';
import { TodoListVM, TodoListViewModelType } from '../../usecases/get-todo-list/todo-list.vm';
import { GetTodoOptionsUsecase } from '../../usecases/get-todo-options/get-todo-options.usecase';
import { TodoOptionVm } from '../../usecases/get-todo-options/todo-options.vm';
import { DisplayListTodoComponent } from './components/display-list-todo/display-list-todo.component';

@Component({
  selector: 'home-root',
  standalone: true,
  imports: [MatToolbarModule, CommonModule, MatCardModule, MatRadioModule, DisplayListTodoComponent, ReactiveFormsModule, MatBadgeModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  public todos$!: Observable<TodoListVM>;

  public options$!: Observable<TodoOptionVm>;

  TodoListViewModelType = TodoListViewModelType;

  filterForm: FormGroup = new FormGroup({
    remaining: new FormControl()
  });
  
  constructor(private getTodoList: GetTodoListUsecase,
              private getTodoOptions: GetTodoOptionsUsecase,
              private updateTodoOptionsGateway: UpdateTodoOptionsGateway) {}

  ngOnInit(): void {
    this.options$ = this.getTodoOptions.run();
    this.todos$ = this.getTodoList.run();

    this.initFilterListener();

  }

  private initFilterListener() {
    this.options$
          .subscribe(option => {
            this.filterForm.patchValue(option, { emitEvent: false});
          });

    this.filterForm.valueChanges
        .subscribe(form => {
          this.updateTodoOptionsGateway.update(form);
        });
  }
}
