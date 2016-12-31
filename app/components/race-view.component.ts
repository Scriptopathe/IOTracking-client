import { Component, Input, ViewChild, ElementRef }  from '@angular/core';
import { ActivatedRoute }                           from '@angular/router'
import { Http, Response }                           from '@angular/http';
import { Observable }                               from 'rxjs/Observable';
import { RaceService }                              from '../services/race.service'
import { RegatasService }                           from '../services/regatas.service'
import { Regata, Race}                              from '../services/server-model'
import * as $ from 'jquery'

@Component({
    selector: 'race-view',
    templateUrl: 'app/components/race-view.template.html'
})

export class RaceViewComponent  {
    public race : Race = null

    constructor(private route : ActivatedRoute, private http : Http, 
        private regataSvc : RegatasService,
        private raceSvc : RaceService) {
        
    }

    ngOnInit() {
        this.route
            .params
            .subscribe(params => {
                var regattaId = params["regata"]
                let regata : Regata = this.regataSvc.findById(regattaId)
                if(regata != null) {
                    let raceId = Number(params["race"])
                    let race : Race = regata.races[raceId]
                    this.race = race
                }
        });
    }
}

