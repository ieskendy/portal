const moment = require('moment');
const lodash = require('lodash');

export class Helper {

  public _ = new lodash;

  public jsonNullToEmpty(json: any): JSON {
    Object.keys(json).map((key) => {
      if (json[key] instanceof Object) {
        if (!Object.keys(json[key]).length && typeof json[key].getMonth !== 'function') {
          json[key] = '';
        } else {
          this.jsonNullToEmpty(json[key]);
        }
      } else if (json[key] === null) {
        json[key] = '';
      }
    });
    return json;
  }

  public replaceAll(str: string, search: string, replacement: string): string {
    return str.split(search).join(replacement);
  }

  public isUrl(url: string): boolean {
   let regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
   return regexp.test(url);
  }

  public isImage(url: string) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
  }

  public dateFromNow(date: Date | string): string {
    if (typeof date === 'string') {
      let valiDate = new Date(date);
      if (String(valiDate) == 'Invalid Date')
        return date;
      return moment(valiDate).fromNow();
    }
    return moment(date).fromNow();
  }

  public findIndex(list: Array<any>, keySearch: string, matchingSearch: string): number {
    let BreakException = {};
    let key = null;
    try {
      list.forEach((el: any, index) => {
        if (el[keySearch] === matchingSearch) {
          key = index;
          throw BreakException;
        }
      });
    } catch (e) {
      if (e !== BreakException) throw e;
    }

    return key;
  }
}
