import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Http, Response }   from '@angular/http';
import { User }             from '../services/server-model';
import { UserService }      from '../services/user.service';
import { Observable }       from 'rxjs/Observable';

// import 'rxjs/Rx';
import 'rxjs/add/operator/map'

@Component({
    selector: 'user-panel',
    providers: [UserService],
    templateUrl: 'app/components/userpanel.template.html'
})

export class UserPanelComponent  { 
    user : User

    constructor(private userService : UserService, private http : Http) {        
        this.user = new User("", "anonymous")    
    }

    
}