import { Injectable }       from '@angular/core';
import { Http, Response }   from '@angular/http';
import { Observable }       from 'rxjs/Rx';
import { Inject }           from '@angular/core';

export class User
{
    constructor(public identifier : string, public username : string) {}
}

@Injectable()
export class UserService {
    
}