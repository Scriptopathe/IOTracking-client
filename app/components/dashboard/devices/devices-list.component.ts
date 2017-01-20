import { Component, Input, ViewChild, ElementRef,
         EventEmitter, Output }                     from '@angular/core'
import { Http, Response }                           from '@angular/http'
import { Observable }                               from 'rxjs/Observable'
import { DomSanitizer, SafeHtml,SafeUrl,SafeStyle } from '@angular/platform-browser'
import { DevicesService }                           from '../../../services/devices.service'
import { Device }                                   from '../../../services/server-model'
import { LoraServerService }                        from '../../../services/loraserver.service'

@Component({
    selector: 'device-list',
    templateUrl: 'app/components/dashboard/devices/devices-list.template.html'
})

export class DeviceListComponent  { 
    public currentDevice : number
    @Input("devices") public devices : Device[]
    @Output("device") currentDeviceChange = new EventEmitter()

    constructor(private sanitizer : DomSanitizer, 
        private loraServer : LoraServerService,
        private devicesSvc : DevicesService) {        
        
    }

    getLoraServerLink(dev : Device) {
        return this.loraServer.getDeviceUrl(dev)
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