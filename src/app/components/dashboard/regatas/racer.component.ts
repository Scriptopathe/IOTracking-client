import { Component, Input, ViewChild, ElementRef }  from '@angular/core';
import { ActivatedRoute, Router }                   from '@angular/router'
import { Http, Response }                           from '@angular/http';
import { Observable }                               from 'rxjs/Observable';
import { RegatasNewService }                        from '../../../services/regatas-new.service'
import { Regata, Race, Racer, Device, Reference }   from '../../../services/server-model'
import { DevicesService }                           from '../../../services/devices.service'
import { NotificationService }                      from '../../../services/notification.service'
import { DomSanitizer, SafeHtml,SafeUrl,SafeStyle } from '@angular/platform-browser'
import * as $ from 'jquery'

@Component({
    selector: 'racer',
    templateUrl: './racer.template.html'
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

    constructor(private router : Router, private route : ActivatedRoute, 
                private http : Http, private regataSvc : RegatasNewService, 
                private sanitizer : DomSanitizer, private devicesSvc : DevicesService,
                private notifications : NotificationService) {
        this.loadDevices();
    }

    onSaveRacer(){
        this.missBoat = this.currentRacer.skipperName == "";
        this.missName = this.currentRacer.boatIdentifier == "";
        this.missDevice = this.devices[this.currentDeviceIndex] == null;

        var incorrectData = this.missBoat || this.missName || this.missDevice
        /* since the races are not identified, save the entire regata */ 
        if (!incorrectData){
            this.currentRacer.device = Reference.create<Device>(this.devices[this.currentDeviceIndex].identifier);
            console.dir(this.currentRacer.device)
            this.regataSvc.postRegata(this.currentRegata).subscribe((value : boolean) => {
                this.notifications.success("Coureur enregistré. Redirection...", 1000, () => {
                    this.router.navigate(['/dashboard/regatas/', this.currentRegata.identifier, 'races', this.raceId, 'edit'])
                })
            }, (err) => {
                this.notifications.failure("Echec de la sauvegarde.")
            })
        }
        else {
            this.notifications.failure("Veuillez renseigner correctement tous les champs.")
        }
    }    

    loadDevices() {
        this.devicesSvc.loadDevices().subscribe((devices : Device[]) => {
            this.devices = devices
        })
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
}


 

