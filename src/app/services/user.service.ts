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
        this.loadUser()
    }

    /**
     * Loads the user form the cookie.
     */
    loadUser() {
        if(document.cookie != null) {
            try {
                // part 1 is the crsf token added by angular
                var parts = document.cookie.split(';')
                this.user = JSON.parse(parts[parts.length - 1])
            } catch(e) {
                this.user = null
            }
        }
    }

    /**
     * Authenticates an user given its username and password.
     */
    public authenticate(username : string, password : string) : Observable<User> {
        var self = this
        return new Observable<User>((subscriber : Subscriber<User>) => {
            this.http.post(Server.LoginUrl, JSON.stringify({ username: username, password: password }))
            .subscribe((response) => {
                self.user = response.json()
                subscriber.next(self.user)
                document.cookie = JSON.stringify(self.user)
            }, (err) => {
                subscriber.error(err)
            })
        })
    }

    /**
     * Logs out the user.
     */
    public logout() {
        this.user = null
    }

    public isStaff() {
        return this.user != null && this.user.role == "staff"
    }
}