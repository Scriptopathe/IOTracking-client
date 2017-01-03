import { Injectable }                   from '@angular/core';
import { Http, Response }               from '@angular/http';
import { Observable, Subscriber }       from 'rxjs/Rx';
import { Inject }                       from '@angular/core';
import { Device, Server }               from './server-model';


@Injectable()
export class DevicesService {

    public constructor(private _http : Http) {
        
    }

    public loadDevices() : Observable<Device[]> {
        return new Observable<Device[]>((subscriber : Subscriber<Device[]>) => {
            this._http.get(Server.DevicesUrl)
            .subscribe((value : Response) => {
                if(value.ok) {
                    let devices = (<any[]>value.json()).map((value) => new Device().loadValues(value))
                    subscriber.next(devices)
                } else {
                    subscriber.error(value.status)
                }
                subscriber.complete()
            })
        })
    }

    public deleteDevice(device : Device) : Observable<boolean> {
        return new Observable<boolean>((subscriber : Subscriber<boolean>) => {
            this._http.delete(Server.DevicesUrl + "/" + device.identifier)
            .subscribe((value : Response) => {
                subscriber.next(value.ok)
                if(!value.ok)
                    subscriber.error(value.status)
                subscriber.complete()
            })
        })
    }

    public updateDevice(device : Device) : Observable<boolean> {
        return new Observable<boolean>((subscriber : Subscriber<boolean>) => {
            this._http.put(Server.DevicesUrl + "/" + device.identifier, JSON.stringify(device))
            .subscribe((value : Response) => {
                subscriber.next(value.ok)
                if(!value.ok)
                    subscriber.error(value.status)
                subscriber.complete()
            })
        })
    }

    public getLowPowerDevices(devices : Device[]) { return devices.filter((value, index) => { return value.batteryLevel < 10 }) }
    public getNewDevices(devices : Device[]) { return devices.filter((value, index) => { return value.name == "" }) }
    public getActiveDevices(devices : Device[]) { return devices.filter((value, index) => { return value.isActive }) }
}