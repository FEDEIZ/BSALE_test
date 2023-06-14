export interface ICRUD<T> {
  //create (item: T): Promise<T>;
  read(id: string): Promise<T>;
  //update (id: string, item: T): Promise<T>;
  //delete (id: string): Promise<boolean>;
}
