import { Component  }                               from '@angular/core'
import { ActivatedRoute, Router }                   from '@angular/router'
import { NotificationService }                      from '../../services/notification.service'
import { UserService }                              from '../../services/user.service'

@Component({
    selector: 'staff-guard',
    template: ''
})
/**
 * Put this component on a page, it will redirect the user if it is not allowed to access the page.
 */
export class StaffGuardComponent  {
    constructor(public userSvc : UserService, private router : Router,
                private route : ActivatedRoute) {
        
        if(!this.userSvc.isStaff()) {
            let next = router.routerState.snapshot.url
            this.router.navigate(['/login', { next: [next] } ])
        }

     }

     ngOnInit() {
         let self = this
         this.userSvc.checkUserSession().subscribe((val) => { }, (err) => {
            let next = self.router.routerState.snapshot.url
            self.router.navigate(['/login', { next: [next] } ])
         })
     }
}