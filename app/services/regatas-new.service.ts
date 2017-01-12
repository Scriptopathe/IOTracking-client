import { Injectable }                   from '@angular/core';
import { Http, Response }               from '@angular/http';
import { Observable, Subscriber }       from 'rxjs/Rx';
import { Inject }                       from '@angular/core';
import { User, Regata, Race, Server }   from './server-model';

export interface Point
{
    x : number;
    y : number;
}


@Injectable()
export class RegatasNewService {
    public constructor(private http : Http) {

    }

    public loadRegatas(after : Date, before : Date) : Observable<Regata[]> {
        var now = new Date()
        var needle = JSON.stringify({
            "endDate" : { "$lte" : before.getTime(), "$gte" : after.getTime() },
            "$orderby" : { "startDate" : -1 } 
        })

        return new Observable<Regata[]>((subscriber : Subscriber<Regata[]>) => {
            this.http
                .get(Server.RegattasUrl + "?needle=" + needle)
                .subscribe((value : Response) => {
                    let regatas = (<Array<any>>value.json()).map(function(regata : any) {
                        return new Regata().loadValues(regata)
                    })
                    subscriber.next(regatas)
                })
        })
    }

    /**
     * Asks the server for regata deletion.
     */
    public deleteRegata(regata : Regata) : Observable<boolean> {
        return new Observable<boolean>((subscriber : Subscriber<boolean>) => {
            this.http.delete(Server.RegattasUrl + "/" + regata.identifier)
            .subscribe((value : Response) => {
                subscriber.next(value.ok)
                subscriber.complete()
            }, (error : Response) => {
                subscriber.error(error.statusText)
            })
        })
    }

    /**
     * Asks the server to create a new regata.
     * The observable will return true if the operation succeeded.
     */
    public postRegata(regata : Regata) : Observable<boolean> {
        return new Observable<boolean>((subscriber : Subscriber<boolean>) => {
            let obs : Observable<Response>
            if(regata.identifier == null) {
                // new regata
                obs = this.http.post(Server.RegattasUrl, JSON.stringify(regata))
            } else {
                // edit regata
                obs = this.http.put(Server.RegattasUrl + "/" + regata.identifier, JSON.stringify(regata))
            }

            obs.subscribe((value : Response) => {
                if(value.ok && regata.identifier == null) {
                    regata.loadValues(value.json())
                }
                subscriber.next(value.ok)
                subscriber.complete()
            }, (error : Response) => {
                subscriber.error(error.statusText)
            })
        })
    }

    public findById(id : string) : Observable<Regata> {
        return new Observable<Regata>((subscriber : Subscriber<Regata>) => { 
            this.http.get(Server.RegattasUrl + "/" + id).subscribe((response : Response) => {
                let regata = new Regata()
                regata.loadValues(response.json())
                subscriber.next(regata)
                subscriber.complete()
            })
        }); 
    }
}