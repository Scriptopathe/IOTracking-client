import { Injectable }                   from '@angular/core';
import { Response }                     from '@angular/http';
import { HttpClient as Http }           from './http-client.service'
import { Observable, Subscriber }       from 'rxjs/Rx';
import { Inject }                       from '@angular/core';
import { User, Regata, Racer,
         FullRace, Race, Server, 
         RaceData, RaceMap,
         Point, TimePoint,
         ServerState }                  from './server-model';

@Injectable()
export class RaceService {

    public constructor(private http : Http) {

    }

    /**
     * Imports a CSV file.
     * @returns An observable on the parsed racers.
     */
    public importCSV(file: File) : Observable<Racer[]> {
        return new Observable<Racer[]>((subcriber : Subscriber<Racer[]>) => {
            let reader = new FileReader()
            let self = this
            reader.onload = function() {
                let separator = ";"
                let text = <string>reader.result
                let lines = text.split('\n')
                let headers = lines[0].split(separator)
                let boatIdCol = headers.indexOf("VOILE")
                let nameCol = headers.indexOf("NOM_1")
                let firstnameCol = headers.indexOf("PRENOM_1")
                let racers : Racer[] = []

                if(boatIdCol < 0 || nameCol < 0 || firstnameCol < 0) {
                    subcriber.error("Mauvais format CSV : colonne VOILE, NOM_1, ou PRENOM_1 manquante.")
                    return
                }

                let lastIndex = Math.max(boatIdCol, firstnameCol, nameCol)

                for(let i = 1; i < lines.length; i++) {
                    let line = lines[i].split(separator)

                    if(line.length < lastIndex)
                        continue

                    let racer = new Racer()
                    racer.boatIdentifier = line[boatIdCol]
                    racer.skipperName = line[firstnameCol] + " " + line[nameCol].slice(0, 1) + "."
                    racer.user = null
                    racer.device = null
                    racers.push(racer)
                }

                subcriber.next(racers)
                subcriber.complete()
            }
            reader.readAsText(file)
        })
    }

    /** ======================================================================
     *  METHODS
     *  =================================================================== */

    public setLiveRace(regattaId : string, raceId : number) : Observable<boolean> {
        var othis = this
        return new Observable<boolean>((subscriber : Subscriber<boolean>) => {
            othis.http.post(Server.LiveUrl, JSON.stringify({ liveRegata: regattaId, liveRaceId: raceId }))
            .subscribe((value : Response) =>
            {
                subscriber.next(value.ok)
                subscriber.complete()
            }, (err) => {
                subscriber.error(err)
            })
        })
    }

    public clearLiveRace() : Observable<boolean> {
        var othis = this
        return new Observable<boolean>((subscriber : Subscriber<boolean>) => {
            othis.http.delete(Server.LiveUrl)
            .subscribe((value : Response) =>
            {
                subscriber.next(value.ok)
                subscriber.complete()
            }, (err) => {
                subscriber.error(err)
            })
        })
    }

    public getLiveRace() : Observable<ServerState> {
        var othis = this
        return new Observable<ServerState>((subscriber : Subscriber<ServerState>) => {
            othis.http.get(Server.LiveUrl)
            .subscribe((value : Response) =>
            {
                if(!value.ok) {
                    subscriber.error(value.status)
                    subscriber.complete()
                    return
                }

                let state = new ServerState()
                state.loadValues(value.json())
                subscriber.next(state)
                subscriber.complete()
            }, (err) => {
                subscriber.error(err)
            })
        })
    }

    public initialize(race : Race) : Observable<Race> {
        var self = this
        return new Observable<Race>((subscriber : Subscriber<Race>) => {
            self.http.post(Server.RaceDataUrl, "{}").subscribe((response) => {
                race.data = response.json()["_id"]
                subscriber.next(race)
            }, (err) => {
                subscriber.error(err)
            })
        })
    }

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
