import { Injectable }       from '@angular/core';
import { Http, Response }   from '@angular/http';
import { Observable }       from 'rxjs/Rx';
import { Inject }           from '@angular/core';
import { User, Role }       from './user.service' ;

export interface Point
{
    x : number;
    y : number;
}

export class Race
{
    // map : Reference<RaceMap>
    // data : Reference<RaceData>
    constructor(public name : string, public startDate : Date, public endDate : Date, public concurrents : Array<User>, public buoys : Array<Point>) {}
}

export class Regata
{
    constructor(public identifier : string, public name : string, public location : string,
                public startDate : Date, public endDate : Date, public races : Race[]) { }
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

    public constructor() {

        this._backendLastRegatas = [
            new Regata("5605605", "Regatta Of Doom", "Lake Montbel", new Date(), new Date(), [new Race("Race de la mort qui tue avec brio dans ton jardin", new Date(), new Date(), [new User("myuserid", "gandalf", Role.staff, null/*[this.findById("5605605")]*/)], null)]),
            new Regata("55605605", "Regatta Of Death", "Lake Montbel", new Date(), new Date(), null),
            new Regata("898989880","Regatta Of Life", "Lake Montbel", new Date(), new Date(), null),
            new Regata("98898989898", "Regatta Of Fire", "Lake Montbel", new Date(), new Date(), null),
            new Regata("121231231135", "Regatta Of Ice", "Lake Montbel", new Date(), new Date(), null)
        ]

        for(let j = 0; j < 100; j++) {
            this._backendLastRegatas.push(new Regata("ID" + j, "Regata " + j, "Lake Montbel", new Date(), new Date(), null))
        }


        this._backendUpcomingRegatas =  [
            new Regata("NEXT", "La prochaine régate", "Lake Montbel", new Date(), new Date(), null),
        ]

        this.loadRegatas(0, 5);

    }

    public loadRegatas(start : number, count : number) : void {
        this.pastRegatasCount = this._backendLastRegatas.length
        this.pastRegatas = this._backendLastRegatas.slice(start, start+count)
        this.upcomingRegatas = this._backendUpcomingRegatas.slice(0, this._backendUpcomingRegatas.length)

        this._lastStart = start
        this._lastCount = count
    }

    public deleteRegata(regata : Regata) {
        let index = this._backendLastRegatas.indexOf(regata) 
        if(index != -1)
            this._backendLastRegatas.splice(index, 1);
        
        index = this._backendUpcomingRegatas.indexOf(regata)
        if(index != -1) {
            this._backendUpcomingRegatas.splice(index, 1);
        }

        this.loadRegatas(this._lastStart, this._lastCount)
    }

    public findById(id : string) : Regata {
        var regatta = this._backendLastRegatas.find((value) => value.identifier == id)
        if(regatta == null) {
            regatta = this._backendUpcomingRegatas.find((value) => value.identifier == id);
        }
        return regatta;
    }
}