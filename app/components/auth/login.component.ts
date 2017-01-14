import { Component  }                               from '@angular/core'
import { ActivatedRoute, Router }                   from '@angular/router'
import { NotificationService }                      from '../../services/notification.service'
import { UserService }                              from '../../services/user.service'

@Component({
    selector: 'login',
    templateUrl: 'app/components/auth/login.template.html'
})
/**
 * Login component
 */
export class LoginComponent  {
    public username : string
    public password : string
    public next : string[]
    constructor(private userSvc : UserService, 
                private notifications : NotificationService,
                private route : ActivatedRoute,
                private router : Router) {
        this.next = ["/"]
    }

    login() {
        this.userSvc.authenticate(this.username, this.password)
        .subscribe((user) => {
            this.notifications.success("Bienvenue ! Vous allez être redirigé.", 1000, () => {
                this.router.navigate(this.next)
            })
        }, (err) => {
            this.notifications.failure("Erreur : mauvais nom d'utilisateur ou mot de passe.", -1)
        })
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if(params['next'] != undefined) {
                this.next = [params['next']]
            }
        })
    }
}