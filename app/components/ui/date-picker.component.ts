import { Component, Input, ViewChild, ElementRef }  from '@angular/core';
import { ActivatedRoute }                           from '@angular/router'
import { Http, Response }                           from '@angular/http';
import { Observable }                               from 'rxjs/Observable';
import * as $                                       from 'jquery'

@Component({
    selector: 'date-picker',
    templateUrl: 'app/components/date-picker.template.html'
})

export class DatePickerComponent  {
    

    constructor() {
    }

    ngOnInit() {}
}