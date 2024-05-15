export enum TodoListViewModelType {
    NoTodo = "NO_TODO",
    Todos = "TODOS"
  }

export type ItemVM = {
  id: number,
  title: string,
  checked: boolean
};

export type TodoListVM = {
    type: TodoListViewModelType.NoTodo,
    message: string
} | {
  type: TodoListViewModelType.Todos,
  items: ItemVM[]
}