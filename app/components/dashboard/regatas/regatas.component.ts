import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Http, Response }   from '@angular/http';
import { Observable }       from 'rxjs/Observable';
import { RegatasService }   from '../../../services/regatas.service'
import { Regata, Race}      from '../../../services/server-model'
@Component({
    selector: 'regatas',
    templateUrl: 'app/components/dashboard/regatas/regatas.template.html'
})

export class RegatasComponent  { 
    public pastRegatasPage : number = 0
    public pastRegatasCountPerPage : number = 5

    constructor(private http : Http, private regataSvc : RegatasService) {        
                                
    }

    /**-------------------------------------------------------------------------------- 
     * Pagination 
     * ----------------------------------------------------------------------------- */
    public getPagesCount() : number {
        return Math.ceil(1.0 * this.regataSvc.pastRegatasCount / this.pastRegatasCountPerPage)
    }

    public getDisplayedPages() : number[] {
        let maxPagesDisplay = 3;
        let pages : number[] = []

        pages.push(0)

        for(let i = -maxPagesDisplay; i <= maxPagesDisplay; i++)
        {
            let page = this.pastRegatasPage + i;
            if(page > 0 && page < this.getPagesCount() - 1)
            {
                pages.push(this.pastRegatasPage + i)
            }
        }

        pages.push(this.getPagesCount()-1)

        return pages
    }

    public setPage(page : number) : void
    {
        if(page < 0 || page > this.getPagesCount())
            return
        
        this.pastRegatasPage = page
        this.reload()
    }
    

    public reload() : void
    {
        this.regataSvc.loadRegatas(this.pastRegatasPage * this.pastRegatasCountPerPage, this.pastRegatasCountPerPage)
    }
}