export interface ISearch<T> {
  search: (query?: string) => Promise<T[]>;
}
