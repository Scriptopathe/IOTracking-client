import { Component, Input, ViewChild, ElementRef }  from '@angular/core';
import { ActivatedRoute }                           from '@angular/router'
import { Http, Response }                           from '@angular/http';
import { Observable }                               from 'rxjs/Observable';
import { RegatasService }                           from '../services/regatas.service'
import { Regata, Race, Racer }                      from '../services/server-model'
import * as $ from 'jquery'

@Component({
    selector: 'racer-edit',
    templateUrl: 'app/components/racer-edit.template.html'
})

export class RacerEditionComponent  {
    //@Input('regata') regataId : string; 
    //@Input('race') raceId : string; 
    regataId : string; 
    indexRace : string; 
    indexRacer : string; 
    currentRegata: Regata; 
    currentRace: Race; 
    currentRacer: Racer; 
    modalId : string;

    constructor(private route : ActivatedRoute, private http : Http, private regataSvc : RegatasService) {
    }

    onSaveRace(){
        // since the races are not identified, save the entire regata  
        this.regataSvc.postRegata(this.currentRegata);
    }

    getModalId() {
        return this.modalId;
    }

    ngOnInit() {
        this.route
            .params
            .subscribe(params => {
                this.indexRacer = params['racer']
                this.indexRace = params['race']
                this.regataId = params['regata']
                this.regataSvc.findById(this.regataId).subscribe((regata : Regata) => {
                    this.currentRegata = regata
                })
                this.currentRace = this.currentRegata.races[this.indexRace]
                this.currentRacer = this.currentRegata.races[this.indexRace].concurrents[this.indexRacer]
                this.modalId = this.currentRegata.name + "_" + this.currentRace.name
        });

        //$(this.modalId).modal();
    }
}

