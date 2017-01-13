import { Component  }                               from '@angular/core'
import { DomSanitizer, SafeHtml,SafeUrl,SafeStyle } from '@angular/platform-browser'
import { NotificationService }                      from '../services/notification.service'
@Component({
    selector: 'notification',
    templateUrl: 'app/components/notification.template.html'
})

export class NotificationComponent  {
    constructor(private sanitizer : DomSanitizer, 
                public notifications : NotificationService) {
        this.notifications.show = false
     }
}