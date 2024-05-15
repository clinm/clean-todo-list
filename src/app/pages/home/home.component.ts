import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Observable, map } from 'rxjs';
import { GetTodoListUsecase } from '../../usecases/get-todo-list.usecase';
import { TodoListVM, TodoListViewModelType } from '../../usecases/todo-list.vm';
import { DisplayListTodoComponent } from './components/display-list-todo/display-list-todo.component';

@Component({
  selector: 'home-root',
  standalone: true,
  imports: [MatToolbarModule, CommonModule, MatCardModule, MatRadioModule, DisplayListTodoComponent, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  public todos$!: Observable<TodoListVM>;

  TodoListViewModelType = TodoListViewModelType;

  filterForm: FormGroup = new FormGroup({
    options: new FormControl()
  });
  
  constructor(private getTodoList: GetTodoListUsecase) {}

  ngOnInit(): void {
    this.initFilterListener();

    this.initForm();
  }

  private initFilterListener() {
    this.filterForm.valueChanges
      .pipe(map(res => ({ remaining: res.options === "true" })))
      .subscribe(res => {
        this.todos$ = this.getTodoList.run(res);
      });
  }

  private initForm() {
    this.filterForm.patchValue({options: "true"});
  }
}
