import { Component, Input, ViewChild, ElementRef }  from '@angular/core';
import { ActivatedRoute }                           from '@angular/router'
import { Http, Response }                           from '@angular/http';
import { Observable }                               from 'rxjs/Observable';
import { RegatasService }                           from '../services/regatas.service'
import { Regata, Race}                              from '../services/server-model'

@Component({
    selector: 'race-edit',
    templateUrl: 'app/components/race.edit.template.html'
})

export class RaceEditionComponent  {
    //@Input('regata') regataId : string; 
    //@Input('race') raceId : string; 
    regataId : string; 
    raceId : string; 
    currentRegata: Regata; 
    currentRace: Race; 

    constructor(private route : ActivatedRoute, private http : Http, private regataSvc : RegatasService) {}

    onSaveRace(){
        //TODO save
    }

    ngOnInit() {
        this.route
            .params
            .subscribe(params => {
                this.raceId = params['raceId']
                this.regataId = params['regataId']
                this.currentRegata = this.regataSvc.findById(this.regataId)
                this.currentRace = this.regataSvc.findRaceById(this.currentRegata, this.raceId)
        });
    }
}

