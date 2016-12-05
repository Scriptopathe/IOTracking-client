import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Http, Response }   from '@angular/http';
import { UserService }      from '../services/user.service';
import { Observable }       from 'rxjs/Observable';
import { Lake }             from '../services/test.service';

// import 'rxjs/Rx';
import 'rxjs/add/operator/map'

@Component({
    selector: 'user-panel',
    providers: [UserService],
    templateUrl: 'app/components/userpanel.template.html'
})

export class UserPanelComponent  { 

    constructor(private userService : UserService, private http : Http) {        
        
    }
}