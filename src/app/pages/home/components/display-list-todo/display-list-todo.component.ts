import { Component, Input } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { ItemVM } from '../../../../usecases/todo-list.vm';

@Component({
  selector: 'app-display-list-todo',
  standalone: true,
  imports: [MatCheckboxModule, MatListModule],
  templateUrl: './display-list-todo.component.html',
  styleUrl: './display-list-todo.component.scss'
})
export class DisplayListTodoComponent {

  @Input()
  items!: ItemVM[];

}
