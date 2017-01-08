import { Component, Input, ViewChild, ElementRef }  from '@angular/core';
import { ActivatedRoute }                           from '@angular/router'
import { Http, Response }                           from '@angular/http';
import { Observable }                               from 'rxjs/Observable';
import { RegatasService }                           from '../services/regatas.service'
import { Regata, Race, Racer, Device }              from '../services/server-model'
import { DevicesService }                           from '../services/devices.service'
import { DomSanitizer, SafeHtml,SafeUrl,SafeStyle } from '@angular/platform-browser'
import * as $ from 'jquery'

@Component({
    selector: 'new-racer',
    templateUrl: 'app/components/new-racer.template.html'
})

export class NewRacerComponent  {
    //@Input('regata') currentRegata: Regata;
    currentDevice : Device;
    devices : Device[] = [];
    //currentBoat : Boat;
    //boats : Boat[] = [];
    currentRacer: Racer; 
    currentRace: Race; 
    currentRegata: Regata; 
    regataId : string; 
    indexRace : string;
    name : string;
    //modalId : string;

    constructor(private route : ActivatedRoute, private http : Http, private regataSvc : RegatasService, private sanitizer : DomSanitizer, private devicesSvc : DevicesService) {
        this.loadDevices();
    }

    onSaveRacer(){
        this.currentRacer = new Racer("", this.name, null, null);
    }

    loadDevices() {
        this.devicesSvc.loadDevices().subscribe((devices : Device[]) => {
            this.devices = devices
        })
    }

    setDevice(device : Device) {
        this.currentDevice = device
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

    ngOnInit() {
        this.route
            .params
            .subscribe(params => {
                this.indexRace = params['race']
                this.regataId = params['regata']
                this.regataSvc.findById(this.regataId).subscribe((regata : Regata) => {
                    this.currentRegata = regata
                    this.currentRace = this.currentRegata.races[this.indexRace]
                })
               // this.modalId = this.currentRegata.name + "_newrace"
        });

        //$(this.modalId).modal()
    }
}


 

