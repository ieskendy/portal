import { Config } from './config';
let sqlite = require( "nativescript-sqlite" );

interface order {
  field: string,
  order: string
}

interface queryOption {
  select?: Array<string>,
  field?: string,
  value?: any,
  orderBy?: order,
  groupBy?: string,
  limit?: number,
  offset?: number
}

interface option {
  table: string,
  query?: queryOption
}

export class DB {

  static instance: DB;
  protected configService = new Config;
  protected dbName: string;
  protected db;

  private dbInstance(cb: Function): void {
    if (DB.instance == null) {
      DB.instance = new DB();
      DB.instance.dbName = this.configService.getConfig(['db', 'name']);
      let connection = new sqlite(DB.instance.dbName, (err, dbConnection) => {
        if (err) {
          console.log(`Failed to open db: ${DB.instance.dbName}`);
          cb(false);
        } else {
          DB.instance.db = dbConnection;
          if (DB.instance.db.isOpen()) {
            cb(dbConnection);
          } else {
            console.log('Closed Connection');
            cb(false);
          }
        }
      });
    } else {
      cb(DB.instance.db);
    }
  }

  public connect(cb: Function): void {
    this.dbInstance(cb);
  }

  private buildReturn(err: any, data: any, cb: Function): void {
    if (err) {
      cb({ error: 'SQL', message: err });
    } else {
      cb({ data });
    }
  }

  private queryBuilder(type: string, option: option): string {
    let queryStr = '${type} ';
    if (option.query.select) {
      let selectStr: string = '';
      for (let select of option.query.select) {
          selectStr = selectStr ? `, ${selectStr}` : `${selectStr} `;
      }
      queryStr += queryStr;
    } else {
      queryStr += `* `;
    }

    queryStr += `${option.table} `;

    if (option.query.field && option.query.value) {
      queryStr += `${option.query.field} = ${option.query.value} `;
    }

    if (option.query.groupBy) {
      queryStr += `GROUP BY ${option.query.groupBy} `;
    }

    if (option.query.orderBy) {
      queryStr += `ORDER BY ${option.query.orderBy.field} ${option.query.orderBy.order} `;
    }

    if (option.query.offset) {
      queryStr += `OFFSET ${option.query.offset} `;
    }

    if (option.query.limit) {
      queryStr += `LIMIT ${option.query.limit}`;
    }

    return queryStr;
  }

  public query(query: string, cb: Function): void {
    this.dbInstance(connection => {
      if (connection) {
        if (this.configService.getConfig(['db', 'debug'])) {
          console.log(`Query: ${query}`);
        }
        connection.execSQL(query, [], (err, id) => {
          this.buildReturn(err, { id }, cb);
        });
      }
    });
  }

  public get(option: option, cb: Function): void {
    this.dbInstance(connection => {
      if (connection) {
        let queryStr = this.queryBuilder('SELECT', option);
        if (this.configService.getConfig(['db', 'debug'])) {
          console.log(`Query: ${queryStr}`);
        }
        connection.all(queryStr, [], (err, row) => {
          this.buildReturn(err, row, cb);
        });
      }
    });
  }

  public update(option: option, cb: Function): void {
    let queryStr = this.queryBuilder('UPDATE', option);
    this.query(queryStr, cb);
  }

  public delete(option: option, cb: Function): void {
    let queryStr = this.queryBuilder('DELETE', option);
    this.query(queryStr, cb);
  }
}
