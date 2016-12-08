import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Http, Response }   from '@angular/http';
import { Observable }       from 'rxjs/Observable';
import { Regata, RegatasService } from '../services/regatas.service'
@Component({
    selector: 'regatas',
    templateUrl: 'app/components/regatas.template.html'
})

export class RegatasComponent  { 
    constructor(private http : Http, private regataSvc : RegatasService) {        
        
    }
}