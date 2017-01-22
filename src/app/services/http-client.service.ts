import { Injectable }           from '@angular/core'
import { Http, Headers }        from '@angular/http'
import { UserService }          from './user.service'

@Injectable()
export class HttpClient {
  constructor(private http: Http, private userSvc : UserService) {}

  createHeaders() {
    let headers = new Headers();
    if(this.userSvc.user) {
        headers.append('Authorization', 'JWT ' + this.userSvc.user.token); 
    }
    return headers
  }

  get(url : string) {
    return this.http.get(url, {
      headers: this.createHeaders()
    });
  }

  post(url : string, data : any) {
    return this.http.post(url, data, {
      headers: this.createHeaders()
    });
  }

  put(url : string, data : any) {
    return this.http.put(url, data, {
      headers: this.createHeaders()
    });
  }

  delete(url : string) {
    return this.http.delete(url, {
      headers: this.createHeaders()
    });
  }
}