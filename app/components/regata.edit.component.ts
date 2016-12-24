import { Component, Input, ViewChild, ElementRef }  from '@angular/core';
import { ActivatedRoute }                           from '@angular/router'
import { Http, Response }                           from '@angular/http';
import { Observable }                               from 'rxjs/Observable';
import { RegatasService }                           from '../services/regatas.service'
import { Regata, Race }                             from '../services/server-model'
@Component({
    selector: 'regata-edit',
    templateUrl: 'app/components/regata.edit.template.html'
})

export class RegataEditionComponent  {
    //@Input('regata') currentRegata: Regata; 
    currentRegata: Regata; 
    currentRace: Race;
    regataId : string; 
    raceId : string; 
    showComponentNewRace : boolean;
    showComponentEditRace : boolean;

    constructor(private route : ActivatedRoute, private http : Http, private regataSvc : RegatasService) {     
        this.showComponentNewRace = false;  

    }
    
    onNewRace(){
        this.showComponentNewRace = true;
        this.currentRace = null // TODO
    }
    
    onRaceEdit() {
        this.showComponentEditRace = true;
        this.currentRace = this.regataSvc.findRaceById(this.currentRegata, this.raceId);
    }

    onSaveRace(){
        //TODO save
        this.showComponentNewRace = false;
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