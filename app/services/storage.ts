import { Helper } from './helper';
const cache = require('nativescript-cache');
let helper = new Helper;

export class Storage {

  public store(key: string, data: any): void {
    try {
      if (!key) {
        throw 'Required key';
      }

      if (cache.get(key)) {
        this.update(key, data);
      } else {
        if (typeof data == 'object') {
          data = JSON.stringify(helper.jsonNullToEmpty(data));
        }
        cache.set(key, data);
      }
    } catch (err) {
      console.log(`Storage Error: ${err}`);
    }
  }

  public update(key: string, data: any): void {
    try {
      if (!key) {
        throw 'Required key';
      }

      if (!cache.get(key)) {
        this.store(key, data);
      } else {
        if (typeof data == 'object') {
            data = JSON.stringify(helper.jsonNullToEmpty(data));
        }
        cache.set(key, data);
      }
    } catch (err) {
      console.log(`Storage Error: ${err}`);
    }
  }

  public get(key: string, isJson: boolean = true): any {
    try {
     if (!key) {
        throw 'Required key';
      }
      let data = cache.get(key);
      if (data) {
        data = isJson ? JSON.parse(data) : cache.get(key);
        return data;
      }
      return null;
    } catch (err) {
      console.log(`Storage Error: ${err}`);
    }
  }

  public destroy(key: string): void {
    try {
     if (!key) {
        throw 'Required key';
      }
      cache.delete(key);
    } catch (err) {
      console.log(`Storage Error: ${err}`);
    }
  }

  public flush(): void {
    cache.clear();
  }
}
