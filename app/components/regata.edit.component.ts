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

    onSave() {
        this.regataSvc.postRegata(this.currentRegata).subscribe((value : Response) => {
            alert("SAVE STATUS : " + value.status + " : " + value.statusText)
        })
    }

    ngOnInit() {
        this.route
            .params
            .subscribe(params => {
                this.regataId = params['regataId']
                if(this.regataId == 'new') {
                    // Create new regata
                    this.currentRegata = new Regata("Nouvelle régate", new Date(), new Date(), "Lieu", [])
                } else {
                    // Edit regata
                    this.regataSvc.findById(this.regataId).subscribe((regata : Regata) => {
                        this.currentRegata = regata
                    })
                }
        });
    }
}