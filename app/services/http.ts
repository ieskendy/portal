import http = require('http');
import { Config } from './config';
import { Storage } from './storage';
import { Session } from './session';
let config = require("../shared/config");

export class Http {

  protected http = http;
  protected storageService = new Storage;
  protected sessionService = new Session;
  protected baseUrl: string;
  protected studentData: any;
  protected token: string;

  private refreshData(): void {
    this.baseUrl = config.apiUrl;

    if (this.storageService.get('student')) {
      this.studentData = this.storageService.get('student');
      this.token = this.studentData.api_token;  
    }
    
  }

  private beforeSend(): boolean {
    this.refreshData();
    if (!this.sessionService.get('connection')) {
      return false;
    }
    return true;
  }

  private getHeaders(): any {
    let headers = {
      'Content-Type': 'application/json'
    };
    
    if (this.studentData) {
      headers['token'] = this.token;
  
    }
    return headers;
  }

  public get(option: { uri: string, url?: string, auth?: boolean }, cb: Function, noConnection?: Function): void {
    if (this.beforeSend()) {

      http.request({
        url: option.url || `${this.baseUrl}${option.uri}`,
        method: 'GET',
        headers: this.getHeaders()
      }).then((response) => {
        if (response.statusCode != 404) {
          cb(response.content.toJSON());
        } else {
          cb({error: { message: response.content.toJSON() }});
        }
      }, (error) => {
        console.log(error);
      });
    } else {
      if (typeof noConnection != 'undefined') {
        noConnection();
      }
    }
  }

  public post(option: { uri: string, data: any, url?: string, auth?: boolean }, cb: Function, noConnection?: Function): void {
    if (this.beforeSend()) {
      http.request({
        url: option.url || `${this.baseUrl}${option.uri}`,
        method: 'POST',
        headers: this.getHeaders(),
        content: JSON.stringify(option.data)
      }).then((response) => {
        if (response.statusCode != 404) {
          cb(response.content.toJSON());
        } else {
          cb({error: { message: response.content.toJSON() }});
        }
      }, (error) => {
        console.log(error);
      });
    } else {
      if (typeof noConnection != 'undefined') {
        noConnection();
      }
    }
  }

  public put(option: { uri: string, data: any, url?: string, auth?: boolean }, cb: Function, noConnection?: Function): void {
    if (this.beforeSend()) {
      http.request({
        url: option.url || `${this.baseUrl}${option.uri}`,
        method: 'PUT',
        headers: this.getHeaders(),
        content: JSON.stringify(option.data)
      }).then((response) => {
        if (response.statusCode != 404) {
          cb(response.content.toJSON());
        } else {
          cb({error: { message: response.content.toJSON() }});
        }
      }, (error) => {
        console.log(error);
      });
    } else {
      if (typeof noConnection != 'undefined') {
        noConnection();
      }
    }
  }

  public delete(option: { uri: string, url?: string, auth?: boolean }, cb: Function, noConnection?: Function): void {
    if (this.beforeSend()) {
      http.request({
        url: option.url || `${this.baseUrl}${option.uri}`,
        method: 'DELETE',
        headers: this.getHeaders()
      }).then((response) => {
        if (response.statusCode != 404) {
          cb(response.content.toJSON());
        } else {
          cb({error: { message: response.content.toJSON() }});
        }
      }, (error) => {
        console.log(error);
      });
    } else {
      if (typeof noConnection != 'undefined') {
        noConnection();
      }
    }
  }
}
