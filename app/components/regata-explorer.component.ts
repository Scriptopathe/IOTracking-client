import { Component, Input, ViewChild, ElementRef }  from '@angular/core';
import { Http, Response }                           from '@angular/http';
import { Observable }                               from 'rxjs/Observable';
import { RegatasNewService }                        from '../services/regatas-new.service'
import { Regata, Race}                              from '../services/server-model'
import { DateHelper }                               from '../helpers/datehelper'
@Component({
    selector: 'regatas',
    templateUrl: 'app/components/regata-explorer.template.html'
})

export class RegataExplorerComponent  { 
    public DateHelper = DateHelper

    public regatas : Regata[] = []
    private _year : number
    private _month : number
    

    constructor(private http : Http, private regataSvc : RegatasNewService) {        
        let now = new Date()

        // Loads this months regatas
        this._year = now.getFullYear()
        this._month = now.getMonth()
        this.loadRegatas(this._year, this._month)
    }

    get year() { return this._year }
    set year(year : number) {
        this._year = year
        this.loadRegatas(year, this.month)
    }

    get month() { return this._month }
    set month(month : number) {
        this._month = month
        this.loadRegatas(this.year, month)
    }

    /** Outputs one of the following :
     *  - 'past' if the regata has ended
     *  - 'future' if the regata will start in the future
     *  - 'now' if the regata is actually happening
     */
    getState(regata : Regata) {
        let now = new Date()
        if(regata.endDate.getTime() < now.getTime())
            return "past"
        if(regata.startDate.getTime() > now.getTime())
            return "future"
        return "now" 
    }

    loadRegatas(year : number, month : number) {
        let after = new Date(year, month, 1)
        let before = new Date(year, month+1, 0)

        this.regataSvc.loadRegatas(after, before).subscribe((regatas : Regata[]) => {
            this.regatas = regatas
        })
    }

    getYears() : number[] {
        let now = new Date()
        let start = now.getFullYear() - 2
        let end = now.getFullYear() + 2
        let years : number[] = []
        for(let i = start; i <= end; i++)
            years.push(i)
        return years
    }

    setMonthRelative(offset : number) {
        let date = new Date(this.year, this.month)
        date.setMonth(this.month + offset)

        this._year = date.getFullYear()
        this._month = date.getMonth()
        this.loadRegatas(this.year, this.month)
    }

    previousMonthDisabled() {
        return (this.month == 0 && this.year == this.getYears()[0]) 
    }

    nextMonthDisabled() {
        return (this.month == 11 && this.year == this.getYears()[this.getYears().length - 1]) 
    }

    goToPreviousMonth() {
        this.setMonthRelative(-1)
    }

    goToNextMonth() {
        this.setMonthRelative(1)
    }
}