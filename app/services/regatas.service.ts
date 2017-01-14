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
export class RegatasService {
    public pastRegatas : Regata[]
    public pastRegatasCount : number
    public upcomingRegatas : Regata[]

    private _lastStart : number
    private _lastCount : number

    public constructor(private http : Http) {
        this.pastRegatas = []
        this.upcomingRegatas = []
        this.pastRegatasCount = 0
    }

    public loadRegatas(start : number, count : number) : Observable<boolean> {
        return new Observable<boolean>((subscriber : Subscriber<boolean>) => {
            var now = new Date()
            var pastRegatasNeedle = "{\"endDate\": {\"$lte\": " + now.getTime() + "}, " + " \"$orderby\": {\"startDate\" : -1 } }"
            var upcomingRegatasNeedle = "{\"endDate\": {\"$gt\": " + now.getTime() + "}, " + " \"$orderby\": {\"startDate\" : -1 } }"
            this.http
                .get(Server.RegattasUrl + "?first=" + start + "&last=" + (start + count) + "&needle=" + pastRegatasNeedle)
                .subscribe((value : Response) => {
                    var regatas = value.json()
                    this.pastRegatas = (<Array<any>>regatas).map(function(regata : any) {
                        return new Regata().loadValues(regata)
                    })
                    this.pastRegatasCount = parseInt(value.headers.get("X-IOTracking-Count"))
                }, (err) => {
                    subscriber.error(err)
                })
            
            this.http
                .get(Server.RegattasUrl + "?needle=" + upcomingRegatasNeedle)
                .subscribe((value : Response) => {
                    var regatas = value.json()
                    this.upcomingRegatas = (<Array<any>>regatas).map(function(regata : any) {
                        return new Regata().loadValues(regata)
                    })
                }, (err) => {
                    subscriber.error(err)
                })
            this._lastStart = start
            this._lastCount = count
        })
    }

    /**
     * Asks the server for regata deletion.
     */
    public deleteRegata(regata : Regata) : Observable<Response> {
        let obs = this.http.delete(Server.RegattasUrl + "/" + regata.identifier)
        obs.subscribe((value : Response) => {
                this.loadRegatas(this._lastStart, this._lastCount)
        })
        return obs
    }

    /**
     * Asks the server to create a new regata.
     */
    public postRegata(regata : Regata) : void {
        if(regata.identifier == null) {
            // new regata
            this.http.post(Server.RegattasUrl, JSON.stringify(regata)).subscribe((value : Response) => {
                if(value.ok) {
                    regata.loadValues(value.json())
                }
            })
        } else {
            // edit regata
            this.http.put(Server.RegattasUrl + "/" + regata.identifier, JSON.stringify(regata))
        }
    }

    public findById(id : string) : Observable<Regata> {
        var regata = this.pastRegatas.find((value) => value.identifier == id)
        if(regata == null) {
            regata = this.upcomingRegatas.find((value) => value.identifier == id);
        }

        // If not in cache, load the regatta
        if(regata == null) {
            return new Observable<Regata>((subscriber : Subscriber<Regata>) => { 
                this.http.get(Server.RegattasUrl + "/" + id).subscribe((response : Response) => {
                    regata = new Regata()
                    regata.loadValues(response.json())
                    subscriber.next(regata)
                    subscriber.complete()
                }, (err) => subscriber.error(err))
            }); 
        }

        return new Observable<Regata>((subscriber : Subscriber<Regata>) => { 
            subscriber.next(regata)
            subscriber.complete()
        });
    }
}