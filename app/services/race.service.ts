import { Injectable }       from '@angular/core';
import { Http, Response }   from '@angular/http';
import { Observable }       from 'rxjs/Rx';
import { Inject }           from '@angular/core';
import { User, Regata,
         Race, Server, 
         RaceData, RaceMap,
         Point, TimePoint } from './server-model';

@Injectable()
export class RaceService {
    private _race : Race
    public raceData : RaceData
    public raceMap : RaceMap

    public constructor(private http : Http) {

    }

    /** ======================================================================
     *  PROPERTIES
     *  =================================================================== */
    public get race() { return this._race }
    public set race(race : Race) {
        this._race = race
        this.raceData = null
        this.raceMap = null
        this.loadRaceData(race)
    }

    /** ======================================================================
     *  METHODS
     *  =================================================================== */
    /**
     * Loads raceData and raceMap actual values using the references in the
     * given race object.
     */
    private loadRaceData(race : Race) {
        this.http.get(Server.RaceDataUrl + "/" + race.data)
            .subscribe((value : Response) => {
                this.raceData = new RaceData()
                this.raceData.loadValues(value.json()) 
            })

        this.http.get(Server.RaceMapUrl + "/" + race.map)
            .subscribe((value : Response) => {
                this.raceMap = new RaceMap()
                this.raceMap.loadValues(value.json())
            })
    }
}
