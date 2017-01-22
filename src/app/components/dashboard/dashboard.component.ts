import { Component, Input, ViewChild, ElementRef }  from '@angular/core';
import { Http, Response }                           from '@angular/http';
import { Observable }                               from 'rxjs/Observable';
import { RegatasNewService }                        from '../../services/regatas-new.service'
import { RaceService }                              from '../../services/race.service'
import { Regata, Race}                              from '../../services/server-model'
import { NotificationService }                      from '../../services/notification.service'

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.template.html'
})

export class DashboardComponent  { 
    liveRegataId : string
    liveRaceId : number
    liveRegata : Regata

    constructor(private http : Http, 
        private regataSvc : RegatasNewService,
        private raceSvc : RaceService,
        private notifications : NotificationService) {        
        
        this.loadLiveRace()
    }

    clearLive() {
        this.raceSvc.clearLiveRace().subscribe((value) => { 
            this.liveRaceId = null
            this.liveRegata = null
            this.liveRegata = null
        }, (err) => {
            this.notifications.failure("Echec de l'opération.")
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
                }, (err) => console.log(err))
            }
        }, (err) => { console.log(err) })
    }
}