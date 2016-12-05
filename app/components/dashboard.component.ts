import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Http, Response }   from '@angular/http';
import { Observable }       from 'rxjs/Observable';

@Component({
    selector: 'dashboard',
    templateUrl: 'app/components/dashboard.template.html'
})

export class DashboardComponent  { 

    constructor(private http : Http) {        
        
    }
}