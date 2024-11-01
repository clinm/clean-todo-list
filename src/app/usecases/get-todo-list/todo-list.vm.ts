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
    type: TodoListViewModelType.NoTodo
} | {
  type: TodoListViewModelType.Todos,
  items: ItemVM[]
}