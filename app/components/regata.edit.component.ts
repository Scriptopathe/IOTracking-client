import { Component, Input, ViewChild, ElementRef }  from '@angular/core';
import { ActivatedRoute }                           from '@angular/router'
import { Http, Response }                           from '@angular/http';
import { Observable }                               from 'rxjs/Observable';
import { Regata, RegatasService }                   from '../services/regatas.service'
@Component({
    selector: 'regata-edition',
    templateUrl: 'app/components/regata.edit.template.html'
})

export class RegataEditionComponent  {
    //@Input('regata') currentRegata: Regata; 
    currentRegata: Regata; 
    currentRace: Regata.Race;
    regataId : string; 
    showComponentNewRace : boolean;

    constructor(private route : ActivatedRoute, private http : Http, private regataSvc : RegatasService) {     
        this.showComponentNewRace = false;   
    }
    
    onNewRace(){
        this.showComponentNewRace = true;
        this.currentRace = this.currentRegata.races.find(raceId);
    }
    

    onSave() {
        //TODOS
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