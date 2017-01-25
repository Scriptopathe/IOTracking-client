import { Injectable }           from '@angular/core'
import { Http, Headers }        from '@angular/http'
import { UserService }          from './user.service'

@Injectable()
export class HttpClient {
  constructor(private http: Http, private userSvc : UserService) {}

  get(url : string) {
    return this.http.get(url, {
      headers: this.userSvc.createHeaders()
    });
  }

  post(url : string, data : any) {
    return this.http.post(url, data, {
      headers: this.userSvc.createHeaders()
    });
  }

  put(url : string, data : any) {
    return this.http.put(url, data, {
      headers: this.userSvc.createHeaders()
    });
  }

  delete(url : string) {
    return this.http.delete(url, {
      headers: this.userSvc.createHeaders()
    });
  }
}