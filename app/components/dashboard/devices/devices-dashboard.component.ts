import { Component, Input, ViewChild, ElementRef }  from '@angular/core'
import { Http, Response }                           from '@angular/http'
import { Observable }                               from 'rxjs/Observable'
import { DomSanitizer, SafeHtml,SafeUrl,SafeStyle } from '@angular/platform-browser'
import { DeviceListComponent }                      from './devices-list.component'
import { DevicesService }                           from '../../../services/devices.service'
import { Device }                                   from '../../../services/server-model'

@Component({
    selector: 'devices-dashboard',
    templateUrl: 'app/components/dashboard/devices/devices-dashboard.template.html'
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

    removeCurrentDevice() {
        if(this.deviceList.currentDevice != null) {
            if(this.devices[this.deviceList.currentDevice].identifier == null) {
                // Just need to erase locally if it was create without being saved.
                this.devices.splice(this.deviceList.currentDevice, 1)
            } else {
                this.devicesSvc.deleteDevice(this.devices[this.deviceList.currentDevice]).subscribe((value) => {
                    if(value) {
                        this.currentDevice = null
                        this.loadDevices()
                    }
                })
            }
        }
    }
    
    hasCurrentDevice() {
        return this.deviceList.currentDevice != null
    }

    addNewDevice() {
        let dev = new Device("EUID", "Nom", 100, false)
        this.devices.push(dev)
        this.setDevice(dev)
    }

    saveDevice() {
        this.devicesSvc.updateDevice(this.devices[this.deviceList.currentDevice]).subscribe((value : boolean) => {  
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