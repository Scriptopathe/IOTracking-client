import { Component, Input, ViewChild, ElementRef }  from '@angular/core';
import { ActivatedRoute, Router }                   from '@angular/router'
import { Http, Response }                           from '@angular/http';
import { Observable }                               from 'rxjs/Observable';
import { RegatasNewService }                        from '../services/regatas-new.service'
import { Regata, Race, Racer, Point, Reference,
    RaceMap, RaceData }                             from '../services/server-model'
import * as $ from 'jquery'

@Component({
    selector: 'race',
    templateUrl: 'app/components/race.template.html'
})

export class RaceComponent  {
    //@Input('regata') currentRegata: Regata; 
    currentRace: Race; 
    currentRegata: Regata;
    regataId : string; 
    raceId : string;
    indexRace : number; // to destroy unfinished races, null if edition 
    //modalId : string;
    newName : string;
    newStartDate : string;
    newEndDate: string;
    missStartDate : boolean = false;
    missEndDate : boolean = false;
    missName : boolean = false;
    newRaceIndex : number;
    isNew : boolean;

    constructor(private router : Router, private route : ActivatedRoute, private http : Http, private regataSvc : RegatasNewService) {
        this.newStartDate = "";
        this.newEndDate = "";
    }

    onRemoveRacer(racerId : number) {
        this.currentRegata.races[this.raceId].concurrents.splice(racerId, 1)
        this.regataSvc.postRegata(this.currentRegata).subscribe((value : bolean) => {})
        this.regataSvc.loadRegatas;
    }

    onNewRacer(){
        this.router.navigate(['dashboard/regatas/', this.currentRegata.identifier, 'races', this.raceId, 'edit', 'newracer']);
    }

    onSaveRace(){
        this.missName = false;
        this.missStartDate = false;
        this.missEndDate = false;
        if (this.newName != "" && this.newStartDate != "" && this.newEndDate != "")
        {
            this.currentRace.name = this.newName;
            this.regataSvc.postRegata(this.currentRegata).subscribe((value : boolean) => {})
            this.regataSvc.loadRegatas;
            this.router.navigate(['/dashboard/regatas/', this.currentRegata.identifier]);
        }
        else {
            if (this.newName == "")
                this.missName = true;
            if (this.newStartDate == "")
                this.missStartDate = true;
            if (this.newEndDate == "")
                this.missEndDate = true;
        }
    }

    onCancel() {
        if (this.indexRace != null) {
            /* delete race if the creation is abandonned */
            this.currentRegata.races.splice(this.indexRace, 1);
            this.regataSvc.postRegata(this.currentRegata).subscribe((value : boolean) => {})
            this.regataSvc.loadRegatas;
        }
        this.router.navigate(['/dashboard/regatas/', this.currentRegata.identifier]);        
    }

    ngOnInit() {
        this.route
            .params
            .subscribe(params => {
                this.regataId = params['regata']
                /* RACE EDITION */
                if (params['race'] != null)
                {                
                    console.log("RACE EDITION");
                    this.raceId = params['race']
                    this.regataSvc.findById(this.regataId).subscribe((regata : Regata) => {
                    this.currentRegata = regata
                    this.currentRace = this.currentRegata.races[this.raceId]
                    this.newName = this.currentRegata.races[this.raceId].name
                    this.indexRace = null;//new name TODO
                    this.isNew = false;
                    })
                }
                /* NEW RACE */
                else {
                    console.log("new RACE ");
                    this.regataSvc.findById(this.regataId).subscribe((regata : Regata) => {
                    this.currentRegata = regata
                    this.currentRace = new Race("Nouvelle Course", new Date(), new Date(), new Array<Racer>(), new Reference<RaceMap>(), new Reference<RaceData>(), new Array<Point>());
                 
                    this.currentRegata.races.push(this.currentRace);
                    this.regataSvc.postRegata(this.currentRegata).subscribe((value : boolean) => {})
                    this.regataSvc.loadRegatas;

                    let index = this.currentRegata.races.findIndex((value : Race) => { return value.name == "Nouvelle Course"; });
                    this.indexRace = index;
                    this.isNew = true;

                    this.raceId = String(this.currentRegata.races.length-1)
                    console.log("new index : " + this.raceId)
                    this.newName = "";
                    })
                }
        });
    }
}