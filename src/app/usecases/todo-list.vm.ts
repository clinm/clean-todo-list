export enum TodoListViewModelType {
    NoTodo = "NO_TODO"
  }

export type TodoListVM = {
    type: TodoListViewModelType.NoTodo,
    message: string
}