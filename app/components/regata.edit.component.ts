import { Component, Input, ViewChild, ElementRef }  from '@angular/core';
import { ActivatedRoute, Router }                   from '@angular/router'
import { Http, Response }                           from '@angular/http';
import { Observable }                               from 'rxjs/Observable';
import { RegatasService }                           from '../services/regatas.service'
import { RaceService }                              from '../services/race.service'
import { Regata, Race }                             from '../services/server-model'
import { DateHelper }                               from '../helpers/datehelper'
@Component({
    selector: 'regata-edit',
    templateUrl: 'app/components/regata.edit.template.html'
})

export class RegataEditionComponent  {
    public DateHelper = DateHelper
    //@Input('regata') currentRegata: Regata; 
    currentRegata: Regata; 
    currentRace: Race;
    regataId : string; 

    showComponentNewRace : boolean;
    showComponentEditRace : boolean;
    isNew : boolean = true;

    newName : string;
    newLocation : string;
    newStartDate : string;
    newEndDate : string;
    missName : boolean = false;
    missLocation : boolean = false;

    liveRegataId : string
    liveRaceId : number

    constructor(private route : ActivatedRoute, private router : Router, private http : Http, 
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

    onNewRace(){
        console.log("regataid = " + this.regataId)
        this.router.navigate(['dashboard/regatas/', this.regataId, 'newrace']);
    }

    removeRace(raceId : number) {
        this.currentRegata.races.splice(raceId, 1)
        this.regataSvc.postRegata(this.currentRegata).subscribe((value : Response) => {})
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
        if (this.newName != "" && this.newLocation != "") {
            this.currentRegata.name = this.newName;
            this.currentRegata.location = this.newLocation;
            this.regataSvc.postRegata(this.currentRegata).subscribe((value : Response) => {})
            this.router.navigate(['/dashboard/regatas']);
        }
        else {
            if (this.newName == "")
                this.missName = true;
            if (this.newLocation == "")
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
                    this.newName = "";
                    this.newLocation = "";
                    this.isNew = true
                    this.regataSvc.postRegata(this.currentRegata).subscribe((value : Response) => {})
                    this.regataSvc.loadRegatas;
                } else {
                    // Edit regata
                    this.regataSvc.findById(this.regataId).subscribe((regata : Regata) => {
                        this.currentRegata = regata
                        this.isNew = false
                        this.newName = this.currentRegata.name;
                        this.newLocation = this.currentRegata.location;   
                    })
                }
                
        });
    }
}