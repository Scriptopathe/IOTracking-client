import { Component, Input, ViewChild, ElementRef }  from '@angular/core';
import { Http, Response }                           from '@angular/http';
import { Observable }                               from 'rxjs/Observable';
import { RegatasNewService }                        from '../../services/regatas-new.service'
import { RaceService }                              from '../../services/race.service'
import { Regata, Race}                              from '../../services/server-model'

@Component({
    selector: 'dashboard',
    templateUrl: 'app/components/dashboard/dashboard.template.html'
})

export class DashboardComponent  { 
    liveRegataId : string
    liveRaceId : number
    liveRegata : Regata

    constructor(private http : Http, 
        private regataSvc : RegatasNewService,
        private raceSvc : RaceService) {        
        
        this.loadLiveRace()
        console.log("constructor")
    }

    ngOnInit() {
        console.log("ng init")
    }

    clearLive() {
        this.raceSvc.clearLiveRace().subscribe((value) => { 
            this.liveRaceId = null
            this.liveRegata = null
            this.liveRegata = null
        })
    }
    
    loadLiveRace() {
        var self = this
        this.raceSvc.getLiveRace().subscribe((serverState) => {
            if(serverState.identifier != null) {
                self.regataSvc.findById(<string>serverState.liveRegata)
                .subscribe((regata) => {
                    self.liveRaceId = serverState.liveRaceId
                    self.liveRegataId = <string>serverState.liveRegata
                    self.liveRegata = regata
                })
            }
        })
    }
}