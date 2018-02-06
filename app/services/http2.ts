import http = require('http');
import { Config } from './config';
import { Storage } from './storage';
import { Session } from './session';

export class Http {

  protected http = http;
  protected configService = new Config;
  protected storageService = new Storage;
  protected sessionService = new Session;
  protected baseUrl: string;
  protected userData: any;
  protected garage: any;
  protected token: string;
  protected httDebug: boolean = false;

  constructor() {
    this.refreshData(false);
  }

  private refreshData(auth: boolean): void {
    if (this.storageService.get('garage')) {
      this.garage = this.storageService.get('garage');
    }

    this.baseUrl = this.configService.getConfig(['api', 'url']);

    if (auth) {
      this.userData = this.storageService.get('user');
      this.garage = this.storageService.get('garage');
      this.token = this.storageService.get('token', false);
    }

    this.httDebug = this.configService.getConfig(['api', 'debug']);
  }

  private beforeSend(auth: boolean): boolean {
    this.refreshData(auth);
    if (!this.sessionService.get('connection')) {
      return false;
    }
    return true;
  }

  private getHeaders(auth: boolean): any {
    let headers = {
      'Content-Type': 'application/json'
    };

    if (this.garage) {
      headers['X-Garage-ID'] = this.garage.id;
    }

    if (auth) {
      headers['Authorization'] = `bearer ${this.token}`;
    }

    return headers;
  }

  public get(option: { uri: string, url?: string, auth?: boolean }, cb: Function, noConnection?: Function): void {
    if (this.beforeSend(option.auth)) {

      http.request({
        url: option.url || `${this.baseUrl}${option.uri}`,
        method: 'GET',
        headers: this.getHeaders(option.auth)
      }).then((response) => {
        if (this.httDebug) {
          console.log(`GET ${this.baseUrl}${option.uri}`);
        }
        if (response.statusCode != 404) {
          cb(response.content.toJSON());
        } else {
          cb({error: { message: response.content.toJSON() }});
        }
      }, (error) => {
        if (this.httDebug) {
          console.log(`${this.baseUrl}${option.uri}`);
        }
        console.log(error);
      });
    } else {
      if (typeof noConnection != 'undefined') {
        noConnection();
      }
    }
  }

  public post(option: { uri: string, data: any, url?: string, auth?: boolean }, cb: Function, noConnection?: Function): void {
    if (this.beforeSend(option.auth)) {
      http.request({
        url: option.url || `${this.baseUrl}${option.uri}`,
        method: 'POST',
        headers: this.getHeaders(option.auth),
        content: JSON.stringify(option.data)
      }).then((response) => {
        if (this.httDebug) {
          console.log(`POST ${this.baseUrl}${option.uri}`);
        }
        if (response.statusCode != 404) {
          cb(response.content.toJSON());
        } else {
          cb({error: { message: response.content.toJSON() }});
        }
      }, (error) => {
        if (this.httDebug) {
          console.log(`${this.baseUrl}${option.uri}`);
        }
        console.log(error);
      });
    } else {
      if (typeof noConnection != 'undefined') {
        noConnection();
      }
    }
  }

  public put(option: { uri: string, data: any, url?: string, auth?: boolean }, cb: Function, noConnection?: Function): void {
    if (this.beforeSend(option.auth)) {
      http.request({
        url: option.url || `${this.baseUrl}${option.uri}`,
        method: 'PUT',
        headers: this.getHeaders(option.auth),
        content: JSON.stringify(option.data)
      }).then((response) => {
        if (this.httDebug) {
          console.log(`PUT ${this.baseUrl}${option.uri}`);
        }
        if (response.statusCode != 404) {
          cb(response.content.toJSON());
        } else {
          cb({error: { message: response.content.toJSON() }});
        }
      }, (error) => {
        if (this.httDebug) {
          console.log(`${this.baseUrl}${option.uri}`);
        }
        console.log(error);
      });
    } else {
      if (typeof noConnection != 'undefined') {
        noConnection();
      }
    }
  }

  public delete(option: { uri: string, url?: string, auth?: boolean }, cb: Function, noConnection?: Function): void {
    if (this.beforeSend(option.auth)) {
      http.request({
        url: option.url || `${this.baseUrl}${option.uri}`,
        method: 'DELETE',
        headers: this.getHeaders(option.auth)
      }).then((response) => {
        if (this.httDebug) {
          console.log(`DELETE ${this.baseUrl}${option.uri}`);
        }
        if (response.statusCode != 404) {
          cb(response.content.toJSON());
        } else {
          cb({error: { message: response.content.toJSON() }});
        }
      }, (error) => {
        if (this.httDebug) {
          console.log(`${this.baseUrl}${option.uri}`);
        }
        console.log(error);
      });
    } else {
      if (typeof noConnection != 'undefined') {
        noConnection();
      }
    }
  }
}
