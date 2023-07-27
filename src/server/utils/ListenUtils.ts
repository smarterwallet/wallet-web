export class ServiceResponse {
  success: boolean;
  message?: string;
}

export class ListenUtils {
  protected static authorizationToken: string = '';

  public static setAuthorizationToken(token: string) {
    ListenUtils.authorizationToken = token;
  }

  protected listeners:any[];

  constructor() {
    this.listeners = [];
  }

  public async init(): Promise<ServiceResponse> {
    return new Promise((resolve)=>{
      resolve({success: true});
    })
  }

  public async sync(): Promise<ServiceResponse> {
    return new Promise((resolve) => {
      resolve({success: true});
    })
  }

  public addEventListener(id:string, callback:Function) {
    this.listeners.push({id, callback});
  }

  public removeEventListener(id:string, callback:Function) {
    for(let i = 0; i < this.listeners.length; i++) {
      if(this.listeners[i].id == id && this.listeners[i].callback == callback) {
        this.listeners.splice(i, 1);
        return;
      }
    }
  }

  public notifyListeners(eventId:string, eventData:any = {}) {
    for(let i = 0; i < this.listeners.length; i++) 
      if(this.listeners[i].id == eventId) 
        this.listeners[i].callback(eventData);
  }
}
