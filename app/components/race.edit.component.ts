import { Component, Input, ViewChild, ElementRef }  from '@angular/core';
import { ActivatedRoute }                           from '@angular/router'
import { Http, Response }                           from '@angular/http';
import { Observable }                               from 'rxjs/Observable';
import { RegatasService }                           from '../services/regatas.service'
import { Regata, Race}                              from '../services/server-model'
import * as $ from 'jquery'

@Component({
    selector: 'race-edit',
    templateUrl: 'app/components/race.edit.template.html'
})

export class RaceEditionComponent  {
    //@Input('regata') regataId : string; 
    //@Input('race') raceId : string; 
    regataId : string; 
    indexRace : string; 
    currentRegata: Regata; 
    currentRace: Race; 
    modalId : string;

    constructor(private route : ActivatedRoute, private http : Http, private regataSvc : RegatasService) {
    }

    onSaveRace(){
        //TODO save
    }

    getModalId() {
        return this.modalId;
    }

    ngOnInit() {
        this.route
            .params
            .subscribe(params => {
                this.indexRace = params['indexRace']
                this.regataId = params['regataId']
                this.regataSvc.findById(this.regataId).subscribe((regata : Regata) => {
                    this.currentRegata = regata
                })
                this.currentRace = this.currentRegata.races[this.indexRace]
                this.modalId = this.currentRegata.name + "_" + this.currentRace.name
        });

        //$(this.modalId).modal();
    }
}

