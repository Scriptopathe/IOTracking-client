import { Component, Input, ViewChild, ElementRef }  from '@angular/core';
import { ActivatedRoute, Router }                   from '@angular/router'
import { Http, Response }                           from '@angular/http';
import { Observable }                               from 'rxjs/Observable';
import { RegatasNewService }                        from '../../../services/regatas-new.service'
import { RaceService }                              from '../../../services/race.service'
import { Regata, Race }                             from '../../../services/server-model'
import { DateHelper }                               from '../../../helpers/datehelper'
import { NotificationService }                      from '../../../services/notification.service'
@Component({
    selector: 'regata-edit',
    templateUrl: './regata.edit.template.html'
})

export class RegataEditionComponent  {
    public DateHelper = DateHelper
    currentRegata: Regata; 
    currentRace: Race;
    regataId : string; 

    showComponentNewRace : boolean;
    showComponentEditRace : boolean;
    isNew : boolean = true;

    missName : boolean = false;
    missLocation : boolean = false;

    liveRegataId : string
    liveRaceId : number

    constructor(private route : ActivatedRoute, private router : Router, private http : Http, 
        private regataSvc : RegatasNewService, private raceSvc : RaceService, 
        private notifications : NotificationService) {     
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

    onNewRace(){
        this.regataSvc.postRegata(this.currentRegata).subscribe((value : boolean) => {
            this.router.navigate(['dashboard/regatas/', this.regataId, 'newrace']);
        }, (err) => {
            this.notifications.failure("Echec de la création de la régate.")
        })
    }

    removeRace(raceId : number) {
        this.currentRegata.races.splice(raceId, 1)
        this.regataSvc.postRegata(this.currentRegata).subscribe((value : boolean) => {
            this.notifications.success("Course supprimée.")
        }, (err) => {
            this.notifications.failure("Echec de la suppression de la course.")
        })
    }
    
    
    clearLive() {
        this.raceSvc.clearLiveRace().subscribe((value) => {
            if(value) {
                this.liveRaceId = null
                this.liveRegataId = null
            }
        })
    }

    onCancel() {
        if (this.isNew == true)
        {   
            this.regataSvc.deleteRegata(this.currentRegata)
        }
        this.router.navigate(['/dashboard/regatas']);        
    }

    onSave() {
        this.missName = false;
        this.missLocation = false;
        if (this.currentRegata.name != "" && this.currentRegata.location != "") {
            this.regataSvc.postRegata(this.currentRegata).subscribe((value : boolean) => {
                this.notifications.success("Régate sauvegardée.", 500, () => {
                    // this.router.navigate(['/dashboard/regatas']);
                })
            }, (err) => {
                this.notifications.failure("Echec de la sauvegarde.")
            })
        }
        else {
            if (this.currentRegata.name == "")
                this.missName = true;
            if (this.currentRegata.location == "")
                this.missLocation = true;
       }
    }

    ngOnInit() {
        this.route
            .params
            .subscribe(params => {
                this.regataId = params['regata']
                if(this.regataId == 'new') {
                    // Create new regata
                    this.currentRegata = new Regata("Nouvelle régate", new Date(), new Date(), "Lieu", new Array<Race>())
                    this.isNew = true
                    this.regataSvc.postRegata(this.currentRegata).subscribe((value : boolean) => {
                        this.regataId = this.currentRegata.identifier;
                    }, (err) => {
                        this.notifications.failure("Erreur lors de la création de la régate")
                    })
                } else {
                    // Edit regata
                    this.regataSvc.findById(this.regataId).subscribe((regata : Regata) => {
                        this.currentRegata = regata
                        this.isNew = false
                    }, (err) => {
                        this.notifications.failure("Erreur de connexion avec le serveur.")
                    })
                }
                
        });
    }
}