import { Component, Input, ViewChild, ElementRef }  from '@angular/core';
import { Http, Response }                           from '@angular/http';
import { User }                                     from '../services/server-model';
import { UserService }                              from '../services/user.service';
import { Observable }                               from 'rxjs/Observable';
import { ActivatedRoute, Router }                   from '@angular/router'

// import 'rxjs/Rx';
import 'rxjs/add/operator/map'

@Component({
    selector: 'user-panel',
    templateUrl: './userpanel.template.html'
})

export class UserPanelComponent  { 

    constructor(private userService : UserService,
        private router : Router) {        
        
    }

    isStaff() {
        return this.userService.isStaff()
    }

    isLogged() {
        return this.userService.user != null
    }
    
    getUsername() {
        if(this.userService.user) 
            return this.userService.user.username
        else
            return "Anonyme"
    }

    logout() {
        this.userService.logout()
        this.router.navigate(['/'])
    }
    
}