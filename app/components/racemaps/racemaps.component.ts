import { Component, Input, ViewChild, ElementRef,
         EventEmitter, Output }                     from '@angular/core'
import { Http, Response }                           from '@angular/http'
import { Observable }                               from 'rxjs/Observable'
import { DomSanitizer, SafeHtml,SafeUrl,SafeStyle } from '@angular/platform-browser'
import { RacemapsService }                          from '../../services/racemaps.service'

@Component({
    selector: 'racemaps',
    templateUrl: 'app/components/racemaps.template.html'
})

export class RacemapsComponent  { 
    
    constructor(private sanitizer : DomSanitizer, private devicesSvc : RacemapsService) {        
        
    }

}