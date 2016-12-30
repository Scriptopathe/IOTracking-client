import { Injectable }       from '@angular/core';
import { Http, Response }   from '@angular/http';
import { Observable }       from 'rxjs/Rx';
import { Inject }           from '@angular/core';
import { User, Reference, Server } from './server-model'
@Injectable()
export class UserService {
    private _userCache : { [userId : string] : User }

    public constructor(private http : Http) {
        this._userCache = {}
    }

    public deleteUser(user : User) {
        //TODO
    }

    public loadUser(id : Reference<User>) {
        this.http.get(Server.UsersUrl + "/" + id).subscribe((value : Response) => {
            let user = new User()
            user.loadValues(value.json())
            this._userCache[<string>id] = user
        })
    }
}