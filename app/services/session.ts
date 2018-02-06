export class Session {

  private data: any = {};
  static instance: Session;

  private checkInstance(): void {
    if (Session.instance == null) {
        Session.instance = new Session();
    }
  }

  public set(key: string, value: any): void {
    this.checkInstance();
    Session.instance.data[key] = value;
  }

  public get(key: string): any {
    this.checkInstance();
    if (Session.instance.data[key]) {
      return Session.instance.data[key];
    }
    return null;
  }

  public remove(key: string): void {
    this.checkInstance();
    delete Session.instance.data[key];
  }
}
