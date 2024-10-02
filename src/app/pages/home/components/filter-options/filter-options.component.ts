import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatRadioModule } from '@angular/material/radio';
import { Observable } from 'rxjs';
import { UpdateTodoOptionsGateway } from '../../../../infra/todo-options/todo-options.gateway';
import { GetTodoOptionsUsecase } from '../../../../usecases/get-todo-options/get-todo-options.usecase';
import { TodoOptionVm } from '../../../../usecases/get-todo-options/todo-options.vm';

@Component({
  selector: 'app-filter-options',
  standalone: true,
  imports: [CommonModule, MatRadioModule, ReactiveFormsModule, MatBadgeModule],
  templateUrl: './filter-options.component.html',
  styleUrl: './filter-options.component.scss'
})
export class FilterOptionsComponent implements OnInit {

    public options$!: Observable<TodoOptionVm>;

    filterForm: FormGroup = new FormGroup({
      remaining: new FormControl()
    });
    
    constructor(private readonly getTodoOptions: GetTodoOptionsUsecase,
                private readonly updateTodoOptionsGateway: UpdateTodoOptionsGateway) {}
  
    ngOnInit(): void {
      this.options$ = this.getTodoOptions.run();
  
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