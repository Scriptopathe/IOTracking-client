import { Component, Input, ViewChild, ElementRef }  from '@angular/core';
import { ActivatedRoute }                           from '@angular/router'
import { Http, Response }                           from '@angular/http';
import { Observable }                               from 'rxjs/Observable';
import { Regata, RegatasService, Race }             from '../services/regatas.service'

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
        this.currentRace = new Race(raceId, name, null /*concurrents : User[]*/, null /*route : Route*/);
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