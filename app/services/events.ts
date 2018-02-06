import { Observable, PropertyChangeData } from 'data/observable';

export class Events {
  static instance: Events;

  public eventListener = new Observable;
  protected eventRegistered = [];

  connect(cb: Function): void {
    if (Events.instance) {
      cb();
      return;
    }

    Events.instance = new Events();
    cb();
  }

  listen(event: string, cb: Function) {
    if (Events.instance.eventRegistered.indexOf(`${event}`) >= 0) {
      return;
    }

    Events.instance.eventRegistered.push(`${event}`);
    if (!Events.instance.eventListener.get(`${event}`)) {
      Events.instance.eventListener.set(`${event}`, null);

      Events.instance.eventListener.addEventListener(Observable.propertyChangeEvent, (pcd: PropertyChangeData) => {
        if (`${event}` == pcd.propertyName.toString()) {
          if (pcd.value != null) {
            cb(pcd.value);
          }
        }
      });
    }
  }

  emit(event: string, data: any) {
    Events.instance.eventListener.set(`${event}`, data);
  }

  disconnect(): void {
    Events.instance.eventRegistered = [];
  }
}
