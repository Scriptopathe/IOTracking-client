import { Component, Input, ViewChild, ElementRef }  from '@angular/core';
import { ActivatedRoute }                           from '@angular/router'
import { Http, Response }                           from '@angular/http';
import { Observable }                               from 'rxjs/Observable';
import { RegatasService }                           from '../services/regatas.service'
import { Regata, Race, Racer }                      from '../services/server-model'
import * as $ from 'jquery'

@Component({
    selector: 'new-race',
    templateUrl: 'app/components/new-race.template.html'
})

export class NewRaceComponent  {
    //@Input('regata') currentRegata: Regata; 
    currentRace: Race; 
    currentRegata: Regata;
    concurrents: Array<Racer>;
    regataId : string; 
    raceId : string; 
    modalId : string;

    constructor(private route : ActivatedRoute, private http : Http, private regataSvc : RegatasService) {
        this.concurrents = null;
    }

    onSaveRace(name : string){
        this.currentRace = new Race(name, new Date(), new Date(), [], "", "", []);
    }

    ngOnInit() {
        this.route
            .params
            .subscribe(params => {
                this.regataId = params['regata']
                this.regataSvc.findById(this.regataId).subscribe((regata : Regata) => {
                    this.currentRegata = regata
                })
        });
    }
}