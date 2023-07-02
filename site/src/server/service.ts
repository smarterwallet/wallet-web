import { Server } from "./server";

export class ServiceResponse {
  success: boolean;
  message?: string;
}

export class Service {
  protected static authorizationToken: string = '';

  public static setAuthorizationToken(token: string) {
    Service.authorizationToken = token;
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
    return new Promise((resolve)=>{
      resolve({success: true});
    })
  }

  protected sendCommand(api:string, params:any): Promise<{status:number, body?:any}> {
    return new Promise((resolve, reject)=>{
      var request = new XMLHttpRequest();
      request.open('POST', api);
      request.setRequestHeader('Content-Type', 'application/json');

      // if(Service.authorizationToken != '')
      //   request.setRequestHeader('Authorization', Service.authorizationToken);
  
      // let payload = {command};

      // if(params) {
      //   payload = {...params};
      //   payload.command = command;
      // }

      let body = JSON.stringify(params);
      console.log('==> ' + body);
      request.send(body);
  
      request.onload = () => {
        console.log('<== ' + request.status + ' ' + request.responseText);
  
        let body = null;
        if (request.responseText != '')
          body = JSON.parse(request.responseText);
  
        resolve({
          status: request.status,
          body: body
        });
      };
  
      request.onerror = (e) => {
        console.log('<== ERROR');
        resolve({
          status: 500,
          body: {message: 'Internal service error!'}
        });
      };
    });
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
