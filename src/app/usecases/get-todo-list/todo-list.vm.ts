export enum TodoListViewModelType {
    NoTodo = "NO_TODO",
    Todos = "TODOS",
    Loading= "LOADING",
    Error = "ERROR"
  }

export type ItemVM = {
  id: number,
  title: string,
  checked: boolean
};

export type TodoListVM = {
    type: TodoListViewModelType.NoTodo | TodoListViewModelType.Loading | TodoListViewModelType.Error,
    message: string
} | {
  type: TodoListViewModelType.Todos,
  items: ItemVM[]
}