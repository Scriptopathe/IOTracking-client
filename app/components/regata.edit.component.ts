import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Http, Response }   from '@angular/http';
import { Observable }       from 'rxjs/Observable';
import { Regata, RegatasService } from '../services/regatas.service'
@Component({
    selector: 'regata-edit',
    templateUrl: 'app/components/regatas.edit.template.html'
})

export class RegataEditionComponent  { 
    constructor(private http : Http, private regataSvc : RegatasService) {        
        
    }
}