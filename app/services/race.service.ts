import { Injectable }       from '@angular/core';
import { Http, Response }   from '@angular/http';
import { Observable, Subscriber }  from 'rxjs/Rx';
import { Inject }           from '@angular/core';
import { User, Regata,
         FullRace, Race, Server, 
         RaceData, RaceMap,
         Point, TimePoint } from './server-model';

@Injectable()
export class RaceService {

    public constructor(private http : Http) {

    }

    /** ======================================================================
     *  METHODS
     *  =================================================================== */
    /**
     * Loads raceData and raceMap actual values using the references in the
     * given race object.
     */
    public loadRaceData(race : Race) : Observable<FullRace> {
        if(race == undefined)
            return null

        var othis = this

        return new Observable<FullRace>((subscriber : Subscriber<FullRace>) => {
            let fullrace : FullRace = new FullRace();
            fullrace.loadValues(race)
            fullrace.map = null
            fullrace.data = null

            othis.http.get(Server.RaceDataUrl + "/" + race.data)
            .subscribe((value : Response) => {
                let data = new RaceData()
                data.loadValues(value.json()) 
                fullrace.data = data
                if(fullrace.map != null) {
                    subscriber.next(fullrace)
                    subscriber.complete()
                }
            })

            othis.http.get(Server.RaceMapUrl + "/" + race.map)
            .subscribe((value : Response) => {
                let map = new RaceMap()
                map.loadValues(value.json())
                fullrace.map = map

                if(fullrace.data != null) {
                    subscriber.next(fullrace)
                    subscriber.complete()
                }
            })
        })
    }
}
