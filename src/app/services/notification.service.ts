import { Injectable }                   from '@angular/core';
import { Inject }                       from '@angular/core';


@Injectable()
export class NotificationService {
    text : string
    type : string
    show : boolean
    progressValue : number

    alertClass : string
    iconClass : string
    animation : string

    public constructor() {
        this.show = false
        this.text = "Hello world !"
        this.type = "success"
        this.alertClass = this.getalertClass(this.type)
        this.iconClass = this.getIcon(this.type)
        this.progressValue = 0
    }

    /** Shows a success notification */
    public success(text : string, duration = 2000, cb? : () => void) {
        this.showNotification("success", text, duration, cb)
    }


    /** Shows a failure notification */
    public failure(text : string, duration = 2000, cb? : () => void) {
        this.showNotification("failure", text, duration, cb)
    }

    /** Shows a failure notification */
    public progress(text : string, progress : number, duration = 2000, cb? : () => void) {
        this.showNotification("progress", text, duration, cb)
        this.progressValue = progress
    }

    /**
     * Hides the notification.
     */
    public hide() {
        // this.show = false
        this.animation = "fadeOutUp"
    }

    /**
     * Shows a notification
     * @param type success, failure, progress, default
     * @param text text to show
     * @param duration duration of the notification (in ms). Default 2000ms.
     *        set to -1 to infinite.
     * @param 
     */
    private showNotification(type : string, text : string, duration : number = 2000, cb? : () => void) {
        this.text = text
        this.type = type
        this.show = true
        this.alertClass = this.getalertClass(this.type)
        this.iconClass = this.getIcon(this.type)
        this.animation = "fadeInDown"
        if(duration > 0) {
            setTimeout(() => { 
                this.hide()
                // Call callback at the end of the animation
                setTimeout(() => { if(cb) cb() }, 500)
            }, duration)
        }
    }

    /** 
     * Updates the progress.
     * @param value progress value (0 - 100) 
     */
    public updateProgress(value : number) {
        this.progressValue = value
    }


    private getalertClass(notifType : string) : string {
        switch(this.type) {
            case "success":
                return "alert-success"
            case "failure":
                return "alert-danger"
            default:
                return "alert-info"
        }
    }

    private getIcon(notifType : string) : string {
        switch(this.type) {
            case "success":
                return "glyphicon glyphicon-ok-sign"
            case "failure":
                return "glyphicon glyphicon-remove-sign"
            default:
                return "glyphicon glyphicon-info-sign"
        }
    }

}