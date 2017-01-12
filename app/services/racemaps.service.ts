import { Injectable }                   from '@angular/core';
import { Http, Response }               from '@angular/http';
import { Observable, Subscriber }       from 'rxjs/Rx';
import { Inject }                       from '@angular/core';
import { RaceMap, Server }              from './server-model';

@Injectable()
export class RacemapsService {
    public constructor(private http : Http) {
        
    }


    public deleteRacemap(racemap : RaceMap) : Observable<boolean> {
        var self = this
        
        return new Observable<boolean>((subscriber : Subscriber<boolean>) => {
            if(racemap.identifier == null) {
                // new racemap
                subscriber.next(true)
                subscriber.complete()
            } else {
                // update racemap
                self.http.delete(Server.RaceMapUrl + "/" + racemap.identifier)
                .subscribe((value) => {
                    if(!value.ok) subscriber.error(value.status)
                    subscriber.next(value.ok)
                    subscriber.complete()
                }, (error : Response) => {
                    subscriber.error(error.statusText)
                })
            }
        })
    }



    public saveRacemap(racemap : RaceMap) : Observable<boolean> {
        var self = this
        return new Observable<boolean>((subscriber : Subscriber<boolean>) => {
            if(racemap.identifier == null) {
                // new racemap
                self.http.post(Server.RaceMapUrl, JSON.stringify(racemap))
                .subscribe((value) => {
                    if(!value.ok) subscriber.error(value.status)
                    subscriber.next(value.ok)
                    subscriber.complete()
                }, (error : Response) => {
                    subscriber.error(error.statusText)
                })

            } else {
                // update racemap
                self.http.put(Server.RaceMapUrl + "/" + racemap.identifier, 
                              JSON.stringify(racemap)).subscribe((value) => {
                    if(!value.ok) subscriber.error(value.status)
                    subscriber.next(value.ok)
                    subscriber.complete()
                }, (error) => {
                    subscriber.error(error.statusText)
                })
            }
        })
    }

    public loadRacemaps() : Observable<RaceMap[]> {
        var self = this
        return new Observable<RaceMap[]>((subscriber : Subscriber<RaceMap[]>) => {
            self.http.get(Server.RaceMapUrl).subscribe((value) => {
                var maps : RaceMap[] = []
                var jsonMaps : any[] = value.json()
                for(let jsonMap of jsonMaps) {
                    var map = new RaceMap()
                    maps.push(map.loadValues(jsonMap))
                }
                subscriber.next(maps)
                subscriber.complete()
            })
        })
    }
}