import observable = require('data/observable');
import { Config } from './config';
import { Storage } from './storage';
const SocketIO = require('nativescript-socket.io');

export class Socket {
  static instance: Socket;
  private configService = new Config;
  private storageService = new Storage;

  private socket;
  private rooms = new observable.Observable;
  public eventListener = new observable.Observable;
  public pageReadyListener = new observable.Observable;

  protected user = this.storageService.get('user');
  private server: string = this.configService.getConfig(['socket', 'url']);
  private socketOptions = { query: { 'token': `${this.storageService.get('token', false)}` } };
  protected connected: boolean = false;
  protected listeningPage = [];
  protected pageSocketRegistered = [];

  start(cb: Function) {
    if (Socket.instance) {
      cb();
      return;
    }

    if (this.socketOptions && this.server) {
      Socket.instance = new Socket();
      Socket.instance.socket = SocketIO.connect(this.server, this.socketOptions);
      Socket.instance.socket.on('connect', (data) => {
        console.log('Socket Connected');
        Socket.instance.pageReadyListener.set('ready', true);
        Socket.instance.connected = true;

        Socket.instance.socket.on('disconnect', () => {
          Socket.instance.pageReadyListener.set('ready', false);
          Socket.instance.connected = false;
          console.log('Socket Disconnect');
        });

        cb();
      });
    }
  }

  subscribe(event: string, page: string, cb: Function, dynamicData?: any) {
    if (Socket.instance.pageSocketRegistered.indexOf(`${page}-${event}`) >= 0) {
      return;
    }

    Socket.instance.pageSocketRegistered.push(`${page}-${event}`);
    if (!Socket.instance.eventListener.get(`${page}-${event}`)) {
      Socket.instance.eventListener.set(`${page}-${event}`, false);
      Socket.instance.socket.on(event, (data) => {
        if (Socket.instance.eventListener.get(`${page}-${event}`) != null) {
          Socket.instance.eventListener.set(`${page}-${event}`, data);
        }
      });
    }

    Socket.instance.eventListener.addEventListener(observable.Observable.propertyChangeEvent, (pcd: observable.PropertyChangeData) => {
      if (`${page}-${event}` == pcd.propertyName.toString() && Socket.instance.listeningPage.indexOf(page) >= 0) {
        if (pcd.value != null) {
          cb(pcd.value, dynamicData);
        }
      }
    });
  }

  unsubscribe(event: string, page: string) {
    Socket.instance.eventListener.set(`${page}-${event}`, null);
  }

  emit(event: string, msg: string) {
    Socket.instance.socket.emit(event, msg);
  }

  disconnect() {
    if (Socket.instance.socket) {
      Socket.instance.socket.disconnect();
    }
  }

  onConnected(page: string, cb: Function) {
    if (Socket.instance.listeningPage.indexOf(page) >= 0) {
      return;
    }

    Socket.instance.listeningPage.push(page);
    if (Socket.instance.connected) {
        cb();
      return;
    }

    Socket.instance.pageReadyListener.addEventListener(observable.Observable.propertyChangeEvent, (pcd: observable.PropertyChangeData) => {
      if ('ready' == pcd.propertyName.toString() && pcd.value == true) {
          cb();
      }
    });
  }

  disconnectPage(page: string) {
    let index = Socket.instance.listeningPage.indexOf(page);
    if (index >= 0) {
      Socket.instance.listeningPage.splice(index, 1);
      console.log(JSON.stringify(Socket.instance.listeningPage));
    }
  }
}
