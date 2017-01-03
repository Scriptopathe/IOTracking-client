import { Component, Input, ViewChild, ElementRef }  from '@angular/core'
import { Http, Response }                           from '@angular/http'
import { Observable }                               from 'rxjs/Observable'
import { DevicesService }                           from '../services/devices.service'
import { DomSanitizer, SafeHtml,SafeUrl,SafeStyle } from '@angular/platform-browser'
import { DeviceListComponent }                      from './devices-list.component'
import { Device }                                   from '../services/server-model'

@Component({
    selector: 'devices-dashboard',
    templateUrl: 'app/components/devices-dashboard.template.html'
})

export class DeviceDashboardComponent  { 
    @ViewChild(DeviceListComponent) deviceList: DeviceListComponent
    public currentDevice : Device;
    public devices : Device[] = []
    constructor(private sanitizer : DomSanitizer, private devicesSvc : DevicesService) {        
        this.loadDevices()
    }

    loadDevices() {
        this.devicesSvc.loadDevices().subscribe((devices : Device[]) => {
            this.devices = devices
        })
    }

    setDevice(device : Device) {
        let index = this.devices.findIndex((value : Device) => { return value.identifier == device.identifier })
        this.deviceList.currentDevice = index 
    }

    get lowPowerDevices() { return this.devicesSvc.getLowPowerDevices(this.devices) }
    get activeDevices() { return this.devicesSvc.getActiveDevices(this.devices) }
    get newDevices() { return this.devicesSvc.getNewDevices(this.devices) }
}