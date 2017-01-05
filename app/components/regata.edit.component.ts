import { Component, Input, ViewChild, ElementRef }  from '@angular/core';
import { ActivatedRoute }                           from '@angular/router'
import { Http, Response }                           from '@angular/http';
import { Observable }                               from 'rxjs/Observable';
import { RegatasService }                           from '../services/regatas.service'
import { RaceService }                              from '../services/race.service'
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
    showComponentNewRace : boolean;
    showComponentEditRace : boolean;

    liveRegataId : string
    liveRaceId : number

    constructor(private route : ActivatedRoute, private http : Http, 
        private regataSvc : RegatasService, private raceSvc : RaceService) {     
        this.showComponentNewRace = false;
        this.currentRegata = null
        this.currentRace = null
        this.raceSvc.getLiveRace().subscribe((serverState) => {
            this.liveRegataId = <string>serverState.liveRegata
            this.liveRaceId = serverState.liveRaceId
        })
    }

    isLive(raceId : number) {
        return this.liveRegataId == this.regataId && raceId == this.liveRaceId
    }

    setLive(raceId : number) {
        this.raceSvc.setLiveRace(this.regataId, raceId).subscribe((value) =>{
            if(value) {
                this.liveRegataId = this.regataId
                this.liveRaceId = raceId
            }
        })
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
                this.regataId = params['regata']
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