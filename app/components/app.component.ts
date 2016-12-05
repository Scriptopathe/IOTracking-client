import { Component }        from '@angular/core';
import { TestComponent }    from './test.component';

@Component({
    selector: 'my-app',
    templateUrl: `app/components/app.template.html`,
})

export class AppComponent 
{
    varz = ["hello", "visual", "Center"]
}