import { Component, Input, Output, SimpleChanges,
         ViewChild, ElementRef, EventEmitter }      from '@angular/core'
import { DateHelper }                               from '../../helpers/datehelper'

@Component({
    selector: 'datepicker',
    templateUrl: './/datepicker.template.html'
})

export class DatePickerComponent  { 
    DateHelper = DateHelper

    @Input()    timestamp : number
    @Output()   timestampChange : EventEmitter<number>

    _year : number
    _month : number
    _day : number
    _hour : number
    _minute : number

    constructor() {
        this.timestampChange = new EventEmitter<number>()
    }

    currentDate() {
        var date = new Date(this.year, this.month, this.day, this._hour, this._minute)
        return date
    }

    /**
     * Called when timestamp is changed from the outside this component.
     */
    ngOnChanges(changes: SimpleChanges) {
        if("timestamp" in changes) {
            this.onTimestampChange(changes["timestamp"].currentValue)
        }
    }

    /** 
     * Updates the timestamp value from (year, month, day)
     */
    updateTimestamp() {
        this.timestamp = this.currentDate().getTime()
        this.timestampChange.emit(this.timestamp)
    }

    /**
     * Updates the internal state when the timestamp changes.
     */
    onTimestampChange(newValue : any) {
        var date : Date
        if(!isNaN(parseInt(newValue))) {
            date = new Date(parseInt(newValue))
        }
        
        date = new Date(newValue)

        // handle invalid date
        if(isNaN(date.getTime())) {
            date = new Date()
        } 
        this._day = date.getDate()
        this._month = date.getMonth()
        this._year = date.getFullYear()
        this._minute = date.getMinutes()
        this._hour = date.getHours()
    }

    getLastDayOfMonth(year : number, month : number) {
        var date = new Date(year, parseInt(String(month))+1, 1)
        date.setDate(0)
        var lastDay = date.getDate()
        return lastDay
    }

    get year() {
        return this._year
    }

    get month() {
        return this._month
    }

    get day() {
        return this._day
    }

    get hour() {
        return this._hour
    }

    get minute() {
        return this._minute
    }

    set year(value : number) {
        this._year = value
        this.day = this.day // check day
    }

    set month(value : number) {
        this._month = value
        this.day = this.day // check day
    }

    set day(value : number) {
        this._day = Math.min(value, this.getLastDayOfMonth(this._year, this._month))
        this.updateTimestamp()
    }

    set hour(value : number) {
        this._hour = value
        this.updateTimestamp()
    }

    set minute(value : number) {
        this._minute = value
        this.updateTimestamp()
    }

    getMonths() {
        return DateHelper.getMonths()
    }

    getHours() {
        return DateHelper.getHours()
    }

    getMinutes() {
        return DateHelper.getMinutes()
    }

    getDays() {
        return DateHelper.getDays().slice(0, this.getLastDayOfMonth(this.year, this.month))
    }
    
    getYears() {
        return DateHelper.getYears(new Date().getFullYear()+2)
    }
}
