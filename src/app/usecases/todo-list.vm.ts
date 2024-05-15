export enum TodoListViewModelType {
    NoTodo = "NO_TODO",
    Todos = "TODOS",
    Loading= "LOADING"
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
  type: TodoListViewModelType.Loading,
  message: string
} | {
  type: TodoListViewModelType.Todos,
  items: ItemVM[]
}