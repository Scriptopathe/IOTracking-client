import { Component, Input, ViewChild, ElementRef }  from '@angular/core';
import { ActivatedRoute, Router }                   from '@angular/router'
import { Http, Response }                           from '@angular/http';
import { Observable }                               from 'rxjs/Observable';
import { RegatasService }                           from '../services/regatas.service'
import { Regata, Race, Racer, Device, Reference }   from '../services/server-model'
import { DevicesService }                           from '../services/devices.service'
import { DomSanitizer, SafeHtml,SafeUrl,SafeStyle } from '@angular/platform-browser'
import * as $ from 'jquery'

@Component({
    selector: 'racer',
    templateUrl: 'app/components/racer.template.html'
})

export class RacerComponent  {
    //@Input('regata') currentRegata: Regata;
    devices : Device[] = [];
    currentRacer: Racer; 
    currentRace: Race; 
    currentRegata: Regata; 
    regataId : string; 
    raceId : string;
    racerId : string; 

    indexRacer : number; // to destroy unfinished racers, null if racer edition

    newName : string;
    newBoatId : string;
    newDeviceId : number;
    //modalId : string;
    missName : boolean = false;
    missBoat : boolean = false;
    missDevice : boolean = false;
    
    isNewRace : boolean = false;

    constructor(private router : Router, private route : ActivatedRoute, private http : Http, private regataSvc : RegatasService, private sanitizer : DomSanitizer, private devicesSvc : DevicesService) {
        this.loadDevices();
        this.regataSvc.loadRegatas;
        this.newName = "";
        this.newBoatId = "";
        this.newDeviceId = null;
    }

    onSaveRacer(){
        this.missBoat = false;
        this.missName = false;
        this.missDevice = false;
        /* since the races are not identified, save the entire regata */ 
        if (this.newName != "" && this.newBoatId != "" && this.devices[this.newDeviceId] != null){
            this.currentRacer.skipperName = this.newName;
            this.currentRacer.boatIdentifier = this.newBoatId;
            this.currentRacer.device = new Reference<Device>(this.newDeviceId);
            this.regataSvc.postRegata(this.currentRegata).subscribe((value : Response) => {})
            this.regataSvc.loadRegatas;
            this.router.navigate(['/dashboard/regatas/', this.currentRegata.identifier, 'races', this.raceId, 'edit']);                
        }
        else {
            if (this.newName == "")
                this.missName = true; 
            if (this.newBoatId == "")
                this.missBoat = true; 
            if (this.devices[this.newDeviceId] == null)
                this.missDevice = true;
        }
    }    

    loadDevices() {
        this.devicesSvc.loadDevices().subscribe((devices : Device[]) => {
            this.devices = devices
        })
    }

    getBackground(energy : number) : SafeStyle {
        let color : string;
        if(energy < 10) {
            color = "orangered"
        } else if (energy < 40) {
            color = "palegoldenrod"
        } else {
            color ="palegreen"
        }
        
        return this.sanitizer.bypassSecurityTrustStyle(
            "repeating-linear-gradient(to right, " + color + ", " + color +
            " 20px, rgba(255, 255, 255, 0) 20px, rgba(255, 255, 255, 0) 25px)")
    }

    /*
    getModalId() {
        return this.modalId;
    }
    */

    onCancel() {
        if (this.indexRacer != null) {
            /* delete racer if the creation is abandonned */
            this.currentRegata.races[this.raceId].concurrents.splice(this.indexRacer, 1)
            this.regataSvc.postRegata(this.currentRegata).subscribe((value : Response) => {})
            this.regataSvc.loadRegatas;
        }
        this.router.navigate(['/dashboard/regatas/', this.currentRegata.identifier, 'races', this.raceId, 'edit']);
    }

    ngOnInit() {
        this.route
            .params
            .subscribe(params => {
                this.regataId = params['regata']
                this.raceId = params['race']
                this.isNewRace = false;

                /* Racer Edition */
                if (params['racer'] != null) {
                    this.racerId = params['racer']
                    this.regataSvc.findById(this.regataId).subscribe((regata : Regata) => {
                    this.currentRegata = regata;
                    this.currentRace = this.currentRegata.races[this.raceId]
                    this.currentRacer = this.currentRace.concurrents[this.racerId]
                
                    let index = this.devices.findIndex((value : Device) => { return value.identifier == this.currentRacer.device });
                    this.newDeviceId = index;
                    this.newName = this.currentRacer.skipperName;
                    this.newBoatId = this.currentRacer.boatIdentifier;
                    this.indexRacer = null;
                    })
                }
                /* New Racer */
                else {
                    this.regataSvc.findById(this.regataId).subscribe((regata : Regata) => {
                    this.currentRegata = regata
                    this.currentRace = this.currentRegata.races[this.raceId];
                    this.currentRacer = new Racer("Temporary Boat Id", "New Racer", null, null);
                    if (this.currentRace == null)
                        console.log("currentRace NULL");
                    else {
                        console.log("race name : " + this.currentRace.name)
                    }
                    if (this.currentRace.concurrents == null)
                        console.log("concurrents NULL")

                    this.currentRace.concurrents.push(this.currentRacer);
                    
                    let index = this.currentRace.concurrents.findIndex((value : Racer) => { return value.skipperName == "New Racer"; });
                    this.indexRacer = index;

                    this.newDeviceId = null;
                    this.newName = "";
                    this.newBoatId = "";
                    })
                }
               // this.modalId = this.currentRegata.name + "_newrace"
        });

        //$(this.modalId).modal()
    }
}


 

