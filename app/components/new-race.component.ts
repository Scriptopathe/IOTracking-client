import { Component, Input, ViewChild, ElementRef }  from '@angular/core';
import { ActivatedRoute }                           from '@angular/router'
import { Http, Response }                           from '@angular/http';
import { Observable }                               from 'rxjs/Observable';
import { RegatasService }                           from '../services/regatas.service'
import { Regata, Race}                              from '../services/server-model'
@Component({
    selector: 'new-race',
    templateUrl: 'app/components/new-race.template.html'
})

export class NewRaceComponent  {
    //@Input('regata') currentRegata: Regata; 
    currentRace: Race; 
    currentRegata: Regata; 
    regataId : string; 
    raceId : string; 
    name : string;

    constructor(private route : ActivatedRoute, private http : Http, private regataSvc : RegatasService) {
    }

    onSaveRace(){
        this.currentRace = {
            buoys : [],
            concurrents : [],
            data : "jiajia",
            endDate : new Date(),
            map : "jiajia",
            name : "jijiajia",
            startDate : new Date()
        }
    }

    ngOnInit() {
        this.route
            .params
            .subscribe(params => {
                this.regataId = params['regataId']
                this.currentRegata = this.regataSvc.findById(this.regataId)
        });
    }
}