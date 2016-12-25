import { Injectable }       from '@angular/core';
import { Http, Response }   from '@angular/http';
import { Observable }       from 'rxjs/Rx';
import { Inject }           from '@angular/core';
import { User }             from './user.service';
import { Regata, Race, Server }          from './server-model';

export interface Position
{
    x : number;
    y : number;
}

@Injectable()
export class RegatasService {
    public pastRegatas : Regata[]
    public pastRegatasCount : number
    public upcomingRegatas : Regata[]

    
    // Back end data simulation
    private _backendLastRegatas : Regata[]
    private _backendUpcomingRegatas : Regata[]

    private _lastStart : number
    private _lastCount : number

    public constructor(private http : Http) {

        this.loadRegatas(0, 5);
    }

    public loadRegatas(start : number, count : number) : void {
        var now = new Date()
        var pastRegatasNeedle = "{\"endDate\": {\"$lte\": " + now.getTime() + "}}"
        var upcomingRegatasNeedle = "{\"endDate\": {\"$gt\": " + now.getTime() + "}}"
        this.http
            .get(Server.RegattasUrl + "?first=" + start + "&last=" + (start + count) + "&needle=" + pastRegatasNeedle)
            .subscribe((value : Response) => {
                console.log(value.text())
                var regatas = value.json()
                this.pastRegatas = (<Array<any>>regatas).map(function(regata : any) {
                    return new Regata().loadValues(regata)
                })
                this.pastRegatasCount = Number(value.headers.get("X-IOTracking-Count"))
            })
        
        this.http
            .get(Server.RegattasUrl + "?needle=" + upcomingRegatasNeedle)
            .subscribe((value : Response) => {
                console.log(value.text())
                var regatas = value.json()
                this.upcomingRegatas = (<Array<any>>regatas).map(function(regata : any) {
                    return new Regata().loadValues(regata)
                })
            })
        this._lastStart = start
        this._lastCount = count
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
    public postRegata(regata : Regata) : Observable<Response> {
        let obs : Observable<Response>
        if(regata.identifier == null) {
            // new regata
            obs = this.http.post(Server.RegattasUrl, JSON.stringify(regata))
        } else {
            // edit regata
            obs = this.http.put(Server.RegattasUrl + "/" + regata.identifier, JSON.stringify(regata))
        }
        return obs
    }

    public findById(id : string) : Regata {
        var regata = this.pastRegatas.find((value) => value.identifier == id)
        if(regata == null) {
            regata = this.upcomingRegatas.find((value) => value.identifier == id);
        }
        return regata;
    }

    public findRaceById(Regata : Regata, id : string) : Race {
        var res : Race;
        for (let race of Regata.races)
        {
            if (true || "TODO" == id)
            {
                res = race;
                break;
            }
        }
        return res;
    }
}