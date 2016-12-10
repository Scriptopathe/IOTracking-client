import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Http, Response }   from '@angular/http';
import { Observable }       from 'rxjs/Observable';
import { Device, DevicesService } from '../services/devices.service'
import { DomSanitizer, SafeHtml,SafeUrl,SafeStyle } from '@angular/platform-browser';
import { DeviceListComponent } from './devices-list.component'
@Component({
    selector: 'devices-dashboard',
    templateUrl: 'app/components/devices-dashboard.template.html'
})

export class DeviceDashboardComponent  { 
    currentDevice : Device;
    @ViewChild(DeviceListComponent) deviceList: DeviceListComponent

    constructor(private sanitizer : DomSanitizer, private devicesSvc : DevicesService) {        

    }

    setDevice(device : Device) {
        let index = this.devicesSvc.devices.findIndex((value : Device) => { return value.identifier == device.identifier })
        this.deviceList.currentDevice = index 
    }

    get lowPowerDevices() { return this.devicesSvc.lowPowerDevices }
    get newDevices() { return this.devicesSvc.newDevices }
    get activeDevices() { return this.devicesSvc.activeDevices }
}