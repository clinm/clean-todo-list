import { Component, Input } from '@angular/core';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { ItemVM } from '../../../../usecases/get-todo-list/todo-list.vm';
import { UpdateTodoItemGateway } from '../../../../infra/todo-list/todo-list.gateway';

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

  constructor(private updateGateway: UpdateTodoItemGateway) {}

  update(item: ItemVM, event: MatCheckboxChange): void {
    const itemEvent: ItemVM = { ...item, checked: event.checked };
    this.updateGateway.update(itemEvent);
  }
}
