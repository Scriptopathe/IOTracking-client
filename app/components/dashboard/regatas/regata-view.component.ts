import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Http, Response }   from '@angular/http';
import { Observable }       from 'rxjs/Observable';
import { RegatasService }   from '../../../services/regatas.service'
import { Regata, Race}      from '../../../services/server-model'
import * as $ from "jquery";

@Component({
    selector: 'regata-view',
    templateUrl: 'app/components/dashboard/regatas/regata-view.template.html'
})

export class RegataViewComponent  { 
    @Input('regata') regata: Regata;
    @ViewChild("panel") panel : ElementRef;
    constructor(private http : Http, private regataSvc : RegatasService) {        
        
    }

    public onRemove()
    {
        let element : HTMLDivElement = this.panel.nativeElement
        element.setAttribute('class', element.getAttribute('class') + ' animated zoomOutDown')
        let othis = this
        $(element).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() { 
            othis.regataSvc.deleteRegata(othis.regata) 
        });
    }

    public onSave()
    {
        //TODO
    }

    public onEdit()
    {
        let element : HTMLDivElement = this.panel.nativeElement
        //TODO edition
    }
}