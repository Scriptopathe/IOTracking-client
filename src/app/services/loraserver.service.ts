import { Injectable }                   from '@angular/core';
import { Response, Http }               from '@angular/http';
import { Observable, Subscriber }       from 'rxjs/Rx';
import { Inject }                       from '@angular/core';
import { Device, Server,
         LoraDevice, LoraServer }       from './server-model';


@Injectable()
export class LoraServerService {

    public constructor(private _http : Http) {
        
    }

    public getDeviceUrl(dev : Device) {
        return LoraServer.UserNodeUrl + "/" + dev.hwid
    }

    public getAppEUI() : Observable<string> {
        return new Observable<string>((subscriber : Subscriber<string>) => {
            this._http.get(Server.AppEUIUrl)
            .subscribe((value : Response) => {
                subscriber.next(value.text())
            }, (err) => {
                subscriber.error(err)
            })
        })
    }

    public createLoraDevice(dev : Device) : Observable<string> {
        return new Observable<string>((subscriber : Subscriber<string>) => {
            this.getAppEUI().subscribe((appEUI) => {
                let loraDev = new LoraDevice(dev.name, dev.hwid, appEUI)
                this._http.post(LoraServer.NodeUrl, loraDev).subscribe((response) => {
                    subscriber.next(response.text())
                }, (err) => subscriber.error(err))
            }, (err) => subscriber.error(err) )
        })
    }

    public deleteDevice(device : Device) : Observable<boolean> {
        return new Observable<boolean>((subscriber : Subscriber<boolean>) => {
            this._http.delete(Server.DevicesUrl + "/" + device.identifier)
            .subscribe((value : Response) => {
                subscriber.next(value.ok)
                subscriber.complete()
            }, (err) => {
                subscriber.error(err)
            })
        })
    }
}