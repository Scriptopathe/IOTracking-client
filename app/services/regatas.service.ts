import { Injectable }       from '@angular/core';
import { Http, Response }   from '@angular/http';
import { Observable }       from 'rxjs/Rx';
import { Inject }           from '@angular/core';

export class Regata
{
    constructor(public name : string, public location : string, public startDate : Date, public endDate : Date) { }
}

@Injectable()
export class RegatasService {
    
    public getRegatas() : Regata[] {
        return [
            new Regata("Regatta Of Doom", "Lake Montbel", new Date(), new Date()),
            new Regata("Regatta Of Death", "Lake Montbel", new Date(), new Date()),
            new Regata("Regatta Of Life", "Lake Montbel", new Date(), new Date()),
            new Regata("Regatta Of Fire", "Lake Montbel", new Date(), new Date()),
            new Regata("Regatta Of Ice", "Lake Montbel", new Date(), new Date())
        ]
    }
}