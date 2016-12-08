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
    public pastRegatas : Regata[]
    public pastRegatasCount : number
    public pastRegatasPage : number = 0
    public pastRegatasCountPerPage : number = 5

    public upcomingRegatas : Regata[]
    public constructor() {
        this.loadRegatas(0, 5);
    }

    public reload() : void
    {
        this.loadRegatas(this.pastRegatasPage * this.pastRegatasCountPerPage, this.pastRegatasCountPerPage)
    }

    public loadRegatas(start : number, count : number) : void {
        var pastRegatas = [
            new Regata("Regatta Of Doom", "Lake Montbel", new Date(), new Date()),
            new Regata("Regatta Of Death", "Lake Montbel", new Date(), new Date()),
            new Regata("Regatta Of Life", "Lake Montbel", new Date(), new Date()),
            new Regata("Regatta Of Fire", "Lake Montbel", new Date(), new Date()),
            new Regata("Regatta Of Ice", "Lake Montbel", new Date(), new Date())
        ]

        for(let j = 0; j < 100; j++) {
            pastRegatas.push(new Regata("Regata " + j, "Lake Montbel", new Date(), new Date()))
        }

        this.pastRegatasCount = pastRegatas.length
        this.pastRegatas = pastRegatas.splice(start, count)
        this.upcomingRegatas =  [
            new Regata("La prochaine régate", "Lake Montbel", new Date(), new Date()),
        ]
    }

    public deletePastRegata(index : number) {
        this.pastRegatas.splice(index, 1);
    }

    public deleteUpcomingRegatas(index : number) {
        this.upcomingRegatas.splice(index, 1);
    }

    /**-------------------------------------------------------------------------------- 
     * Pagination 
     * ----------------------------------------------------------------------------- */
    public getPagesCount() : number {
        return Math.ceil(1.0 * this.pastRegatasCount / this.pastRegatasCountPerPage)
    }

    public getDisplayedPages() : number[] {
        let maxPagesDisplay = 3;
        let pages : number[] = []

        pages.push(0)

        for(let i = -maxPagesDisplay; i <= maxPagesDisplay; i++)
        {
            let page = this.pastRegatasPage + i;
            if(page > 0 && page < this.getPagesCount())
            {
                pages.push(this.pastRegatasPage + i)
            }
        }

        pages.push(this.getPagesCount())

        return pages
    }

    public setPage(page : number) : void
    {
        if(page < 0 || page > this.getPagesCount())
            return
        
        this.pastRegatasPage = page
        this.reload()
    }
}