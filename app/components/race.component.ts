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
    currentRace: Race; 
    currentRegata: Regata;
    regataId : string; 
    raceId : string;
    indexRace : number; // to destroy unfinished races, null if edition 

    missStartDate : boolean = false;
    missEndDate : boolean = false;
    missName : boolean = false;
    isNew : boolean;

    constructor(private router : Router, private route : ActivatedRoute, private http : Http, private regataSvc : RegatasNewService) {
    }

    onRemoveRacer(racerId : number) {
        this.currentRegata.races[this.raceId].concurrents.splice(racerId, 1)
        this.regataSvc.postRegata(this.currentRegata).subscribe((value : boolean) => {})
    }

    onNewRacer(){
         this.regataSvc.postRegata(this.currentRegata).subscribe((value : boolean) => {
            this.router.navigate(['dashboard/regatas/', this.currentRegata.identifier, 'races', this.raceId, 'edit', 'newracer']);
         })
    }

    onSaveRace(){
        this.missName = false;
        this.missStartDate = false;
        this.missEndDate = false;
        if (this.currentRace.name != "" /* && this.currentRace.startDate != "" && this.currentRace.endDate != "" */)
        {
            this.regataSvc.postRegata(this.currentRegata).subscribe((value : boolean) => {
                this.router.navigate(['/dashboard/regatas/', this.currentRegata.identifier]);
            })

        }
        else {
            if (this.currentRace.name == "")
                this.missName = true;
            /*      
            if (this.currentRace.startDate == "")
                this.missStartDate = true;
            if (this.currentRace.endDate == "")
                this.missEndDate = true;
            */
        }
    }

    onCancel() {
        if (this.indexRace != null) {
            /* delete race if the creation is abandonned */
            this.currentRegata.races.splice(this.indexRace, 1);
            this.regataSvc.postRegata(this.currentRegata).subscribe((value : boolean) => {
                this.router.navigate(['/dashboard/regatas/', this.currentRegata.identifier]);        
            })
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
                    this.raceId = params['race']
                    this.regataSvc.findById(this.regataId).subscribe((regata : Regata) => {
                        this.currentRegata = regata
                        this.currentRace = this.currentRegata.races[this.raceId]
                        this.indexRace = null;
                        this.isNew = false;
                    })
                }
                /* NEW RACE */
                else {
                    this.regataSvc.findById(this.regataId).subscribe((regata : Regata) => {
                        this.currentRegata = regata
                        this.currentRace = new Race("Nouvelle Course", new Date(), new Date(), new Array<Racer>(), new Reference<RaceMap>(), new Reference<RaceData>(), new Array<Point>());
                        this.currentRegata.races.push(this.currentRace);
                        this.regataSvc.postRegata(this.currentRegata).subscribe((value : boolean) => {
                            let index = this.currentRegata.races.findIndex((value : Race) => { return value.name == "Nouvelle Course"; });
                            this.indexRace = index;
                            this.isNew = true;
                            this.raceId = String(this.currentRegata.races.length-1)
                        })                        
                    })
                }
        });
    }
}