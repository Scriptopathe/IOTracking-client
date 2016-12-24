import { Injectable }       from '@angular/core';
import { Http, Response }   from '@angular/http';
import { Observable }       from 'rxjs/Rx';
import { Inject }           from '@angular/core';

export class Device
{
    constructor(public identifier : string, public name : string, public batteryLevel : number, public isActive? : boolean) { }
}

@Injectable()
export class DevicesService {

    public devices : Device[]
    public devicesCount : number

    
    // Back end data simulation
    private _backendDevices : Device[]

    private _lastStart : number
    private _lastCount : number

    public constructor(private _http : Http) {
        
        this._backendDevices = []

        this._backendDevices.push(new Device("ID" + 9000, "", 100))

        for(let j = 0; j < 100; j++) {
            this._backendDevices.push(new Device("ID" + j, "Device " + j, Math.ceil(Math.random() * 100), j % 7 == 0))
        }


        this.loadDevices(0, this._backendDevices.length-1);
    }

    public loadDevices(start : number, count : number) : void {
        this.devicesCount = this._backendDevices.length
        this.devices = this._backendDevices.slice(start, start+count)
        
        this._lastStart = start
        this._lastCount = count
    }

    public deleteDevice(Device : Device) {
        let index = this._backendDevices.indexOf(Device) 
        if(index != -1)
            this._backendDevices.splice(index, 1);

        this.loadDevices(this._lastStart, this._lastCount)
    }

    get lowPowerDevices() { return this.devices.filter((value, index) => { return value.batteryLevel < 10 }) }
    get newDevices() { return this.devices.filter((value, index) => { return value.name == "" }) }
    get activeDevices() { return this.devices.filter((value, index) => { return value.isActive }) }
}