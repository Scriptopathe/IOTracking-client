import { Injectable }                   from '@angular/core';
import { Http, Response }               from '@angular/http';
import { Observable }                   from 'rxjs/Observable';
import { Subscriber }                   from 'rxjs/Subscriber';
import { Inject }                       from '@angular/core';
import { User, Reference, Server }      from './server-model';

@Injectable()
export class UserService {
    public user : User

    public constructor(private http : Http) {
        this.user = null
    }

    public authenticate(username : string, password : string) : User {
        return new User(username, "staff")
    }

    public loadUser(id : Reference<User>) : Observable<User> {
        var self = this
        return new Observable<User>((subcriber : Subscriber<User>) => {
            this.http.get(Server.UsersUrl + "/" + id).subscribe((value : Response) => {
                let user = new User()
                user.loadValues(value.json())
                self.user = user
            })
        })
    }

    public isStaff() {
        return this.user != null && this.user.role == "staff"
    }
}