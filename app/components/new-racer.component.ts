import { Component, Input, ViewChild, ElementRef }  from '@angular/core';
import { ActivatedRoute }                           from '@angular/router'
import { Http, Response }                           from '@angular/http';
import { Observable }                               from 'rxjs/Observable';
import { RegatasService }                           from '../services/regatas.service'
import { Regata, Race, Racer }                      from '../services/server-model'
import * as $ from 'jquery'

@Component({
    selector: 'new-racer',
    templateUrl: 'app/components/new-racer.template.html'
})

export class NewRacerComponent  {
    //@Input('regata') currentRegata: Regata; 
    currentRacer: Racer; 
    currentRace: Race; 
    currentRegata: Regata; 
    regataId : string; 
    indexRace : string;
    name : string;
    modalId : string;

    constructor(private route : ActivatedRoute, private http : Http, private regataSvc : RegatasService) {
    }

    onSaveRace(){
        this.currentRacer = new Racer("", this.name, null, null);
    }

     getModalId() {
        return this.modalId;
    }

    ngOnInit() {
        this.route
            .params
            .subscribe(params => {
                this.indexRace = params['race']
                this.regataId = params['regata']
                this.regataSvc.findById(this.regataId).subscribe((regata : Regata) => {
                    this.currentRegata = regata
                    this.currentRace = this.currentRegata.races[this.indexRace]
                })
               // this.modalId = this.currentRegata.name + "_newrace"
        });

        //$(this.modalId).modal()
    }
}