export class HttpUtils {

  public static sendCommand(api: string, params: any): Promise<{ status: number, body?: any }> {
    return this.request("POST", api, params);
  }

  public static getRequest(api: string): Promise<{ status: number, body?: any }> {
    return this.request("GET", api, null);
  }

  private static request(method: string, api: string, params: any): Promise<{ status: number, body?: any }> {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open(method, api);
      request.setRequestHeader('Content-Type', 'application/json');

      let body = JSON.stringify(params);
      request.send(body);

      request.onload = () => {
        let body = null;
        if (request.responseText != '') {
          body = JSON.parse(request.responseText);
        }
        resolve({
          status: request.status,
          body: body
        });
      };

      request.onerror = (e) => {
        resolve({
          status: 500,
          body: {message: 'Internal service error!'}
        });
      };
    });
  }

}
