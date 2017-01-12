import { Component, Input, ViewChild, ElementRef }  from '@angular/core';
import { ActivatedRoute, Router }                   from '@angular/router'
import { Http, Response }                           from '@angular/http';
import { Observable }                               from 'rxjs/Observable';
import { RegatasNewService }                        from '../../../services/regatas-new.service'
import { Regata, Race, Racer, Device, Reference }   from '../../../services/server-model'
import { DevicesService }                           from '../../../services/devices.service'
import { DomSanitizer, SafeHtml,SafeUrl,SafeStyle } from '@angular/platform-browser'
import * as $ from 'jquery'

@Component({
    selector: 'racer',
    templateUrl: 'app/components/dashboard/regatas/racer.template.html'
})

export class RacerComponent  {
    devices : Device[] = [];
    currentRacer: Racer; 
    currentRace: Race; 
    currentRegata: Regata; 
    currentDeviceIndex : number; 
    regataId : string; 
    raceId : string;
    racerId : string;

    indexRacer : number; // to destroy unfinished racers, null if racer Edition

    missName : boolean = false;
    missBoat : boolean = false;
    missDevice : boolean = false;
    
    isNewRace : boolean = false;

    constructor(private router : Router, private route : ActivatedRoute, private http : Http, private regataSvc : RegatasNewService, private sanitizer : DomSanitizer, private devicesSvc : DevicesService) {
        this.loadDevices();
    }

    onSaveRacer(){
        this.missBoat = false;
        this.missName = false;
        this.missDevice = false;
        /* since the races are not identified, save the entire regata */ 
        if (this.currentRacer.skipperName != "" && this.currentRacer.boatIdentifier != "" && this.devices[this.currentDeviceIndex] != null){
            this.currentRacer.skipperName = this.currentRacer.skipperName;
            this.currentRacer.boatIdentifier = this.currentRacer.boatIdentifier;
            this.currentRacer.device = new Reference<Device>(this.currentDeviceIndex);
            this.regataSvc.postRegata(this.currentRegata).subscribe((value : boolean) => {
                this.router.navigate(['/dashboard/regatas/', this.currentRegata.identifier, 'races', this.raceId, 'edit']);  
            })                 
        }
        else {
            if (this.currentRacer.skipperName == "")
                this.missName = true; 
            if (this.currentRacer.boatIdentifier == "")
                this.missBoat = true; 
            if (this.devices[this.currentDeviceIndex] == null)
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

    onCancel() {
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
                        this.currentDeviceIndex = index;
                        this.indexRacer = null;
                    })
                }
                /* New Racer */
                else {
                    this.regataSvc.findById(this.regataId).subscribe((regata : Regata) => {
                        this.currentRegata = regata
                        this.currentRace = this.currentRegata.races[this.raceId];
                        this.currentRacer = new Racer("Boat Name", "New Racer", null, null);
                        this.currentRace.concurrents.push(this.currentRacer);
                        
                        let index = this.currentRace.concurrents.findIndex((value : Racer) => { return value.skipperName == "New Racer"; });
                        this.indexRacer = index;
                        this.currentDeviceIndex = null;
                    })
                }
        });
    }
}


 

