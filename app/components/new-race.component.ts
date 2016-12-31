import { Component, Input, ViewChild, ElementRef }  from '@angular/core';
import { ActivatedRoute }                           from '@angular/router'
import { Http, Response }                           from '@angular/http';
import { Observable }                               from 'rxjs/Observable';
import { RegatasService }                           from '../services/regatas.service'
import { Regata, Race}                              from '../services/server-model'
import * as $ from 'jquery'

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
    modalId : string;

    constructor(private route : ActivatedRoute, private http : Http, private regataSvc : RegatasService) {
    }

    onSaveRace(){
        this.currentRace = new Race(this.name, new Date(), new Date(), [], "", "", []);
    }

     getModalId() {
        return this.modalId;
    }

    ngOnInit() {
        this.route
            .params
            .subscribe(params => {
                this.regataId = params['regataId']
                this.regataSvc.findById(this.regataId).subscribe((regata : Regata) => {
                    this.currentRegata = regata
                })
                this.modalId = this.currentRegata.name + "_newrace"
        });

        //$(this.modalId).modal()
    }
}