import { Injectable }       from '@angular/core';
import { Http, Response }   from '@angular/http';
import { Observable }       from 'rxjs/Rx';
import { Inject }           from '@angular/core';
import { Regata }           from './regatas.service' ;

export enum Role {
    staff,
    member,
    anonymous
}

export class User
{
    constructor(public identifier : string, public username : string, public role : Role, public regatasDone : Regata[]) {}
}

@Injectable()
export class UserService {
    
    private _allUsers : User[];

    public deleteUser(user : User) {
        //TODO
    }

    public findById(id : string) : User {
        var user = this._allUsers.find((value) => value.identifier == id)
        return user;
    }
}