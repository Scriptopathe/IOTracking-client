import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute }                          from '@angular/router'
import { DateHelper }                              from '../../helpers/datehelper'
import { Http, Response }                          from '@angular/http';
import { Observable }                              from 'rxjs/Observable';
import { RegatasService }                          from '../../services/regatas.service'
import { Regata, Race}                             from '../../services/server-model'
import * as $ from "jquery";

@Component({
    selector: 'regata-fullview',
    templateUrl: 'app/components/explorer/regata-fullview.template.html'
})

export class RegataFullViewComponent  {
    public DateHelper = DateHelper
    public regata : Regata
    
    constructor(private route : ActivatedRoute, private http : Http, private regataSvc : RegatasService) {        
        
    }

    ngOnInit() {
        this.route
            .params
            .subscribe(params => {
                let regataId = params['regata']
                this.regataSvc.findById(regataId).subscribe((regata : Regata) => {
                        this.regata = regata
                    })
                }
        );
    }
}