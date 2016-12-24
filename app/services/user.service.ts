import { Injectable }       from '@angular/core';
import { Http, Response }   from '@angular/http';
import { Observable }       from 'rxjs/Rx';
import { Inject }           from '@angular/core';
import { Regata }           from './regatas.service' ;

export class User
{
    constructor(public identifier : string, public username : string, public regatasDone : Regata[]) {}
}

@Injectable()
export class UserService {
    
}