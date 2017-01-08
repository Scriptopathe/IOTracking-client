import { Component, Input, ViewChild, ElementRef }  from '@angular/core';

@Component({
    selector: 'breadcumb',
    templateUrl: 'app/components/ui/breadcumb.template.html'
})

export class BreadcumbComponent  { 
    @Input("labels") labels : string[]
    @Input("routes") routes : string[][]

    constructor() {
        this.labels = null
        this.routes = null
    }


}