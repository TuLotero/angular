export class IndexedDb {

  private connection: any;

  constructor(private driver: IDBFactory) {
  }

  open(name: string): Promise<IDBOpenDBRequest> {
    // @ts-ignore
    return new Promise(((resolve, reject) => {
      const conn = this.driver.open(name);
      conn.onsuccess = (event: any) => {
        this.connection = conn.result;
        resolve(conn.result);
      };
      conn.onerror = (event: any) => reject(conn.error);
    }));
  }

  read(table: string, id: string): Promise<string> {
    // @ts-ignore
    return new Promise(((resolve, reject) => {
      const tx = this.connection.transaction(table);
      const req = tx.get(id);
      req.onsuccess = (event: any) => resolve(event.result);
      req.onerror = (event: any) => reject(event.error);
    }))
  }

  write(table: string, key: string, value: string): Promise<boolean> {
    // @ts-ignore
    return new Promise(((resolve, reject) => {
      const tx = this.connection.transaction(table, 'readwrite');
      const req = tx.put({key: key, value: value});
      req.onsuccess = (event: any) => resolve(true);
      req.onerror = (event: any) => reject(event.error);
    }))
  }
}
