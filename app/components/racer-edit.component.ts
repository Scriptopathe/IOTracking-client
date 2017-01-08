import { Component, Input, ViewChild, ElementRef }  from '@angular/core';
import { ActivatedRoute }                           from '@angular/router'
import { Http, Response }                           from '@angular/http';
import { Observable }                               from 'rxjs/Observable';
import { RegatasService }                           from '../services/regatas.service'
import { Regata, Race, Racer, Device }              from '../services/server-model'
import { DevicesService }                           from '../services/devices.service'
import { DomSanitizer, SafeHtml,SafeUrl,SafeStyle } from '@angular/platform-browser'
import * as $                                       from 'jquery'

@Component({
    selector: 'racer-edit',
    templateUrl: 'app/components/racer-edit.template.html'
})

export class RacerEditionComponent  {
    //@Input('regata') regataId : string; 
    //@Input('race') raceId : string; 
    currentDevice : Device;
    devices : Device[] = [];
    //currentBoat : Boat;
    //boats : Boat[] = [];
    regataId : string; 
    indexRace : string; 
    indexRacer : string; 
    currentRegata: Regata; 
    currentRace: Race; 
    currentRacer: Racer; 
    modalId : string;

    constructor(private route : ActivatedRoute, private http : Http, private regataSvc : RegatasService, private sanitizer : DomSanitizer, private devicesSvc : DevicesService) {
        this.loadDevices()
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

    onSaveRacer(){
        // since the races and racers are not identified, save the entire regata  
       // this.regataSvc.updateRegata(this.currentRegata);
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
                this.indexRacer = params['racer']
                this.indexRace = params['race']
                this.regataId = params['regata']
                this.regataSvc.findById(this.regataId).subscribe((regata : Regata) => {
                    this.currentRegata = regata
                    this.currentRace = this.currentRegata.races[this.indexRace]
                    this.currentRacer = this.currentRegata.races[this.indexRace].concurrents[this.indexRacer]
              })
              
                //this.modalId = this.currentRegata.name + "_" + this.currentRace.name
        });

        //$(this.modalId).modal();
    }
}

