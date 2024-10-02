import { Component } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { CreateTodoItem } from "../../../../infra/todo-list/create-todo-item.model";
import { CreateTodoItemGateway } from "../../../../infra/todo-list/todo-list.gateway";

@Component({
    selector: 'app-create-todo',
    standalone: true,
    imports: [ReactiveFormsModule, FormsModule, MatInputModule, MatButtonModule, MatIconModule],
    templateUrl: './create-todo.component.html',
    styleUrl: './create-todo.component.scss'
  })
  export class CreateTodoComponent {
      
    createForm: FormGroup = new FormGroup({
        title: new FormControl("", [Validators.required, Validators.minLength(1)])
    });

    constructor(private readonly createTodoItemGateway: CreateTodoItemGateway){}

    onSubmit() {
        const raw = this.createForm.getRawValue() as CreateTodoItem;
        this.createTodoItemGateway.create(raw);
        this.createForm.reset();
    }

}