import { Component, Input, ViewChild, ElementRef,
         EventEmitter, Output }                     from '@angular/core'
import { Http, Response }                           from '@angular/http'
import { Observable }                               from 'rxjs/Observable'
import { DomSanitizer, SafeHtml,SafeUrl,SafeStyle } from '@angular/platform-browser'
import { RacemapsService }                          from '../../../services/racemaps.service'
import { RaceMap, Server }                          from '../../../services/server-model'
import { NotificationService }                      from '../../../services/notification.service'
@Component({
    selector: 'racemaps',
    templateUrl: './racemaps.template.html'
})

export class RacemapsComponent  {
    selectedFile : File
    racemaps : RaceMap[]
    racemapIndex : number
    
    imgRefreshNumber : number
    isUploading : boolean
    uploadProgress : number

    constructor(private sanitizer : DomSanitizer, private racemapsSvc : RacemapsService, 
                public notifications : NotificationService) {
        this.loadRacemaps()
        this.racemapIndex = 0
        this.imgRefreshNumber = 0
        this.racemapsSvc.progress.subscribe((progress) => this.uploadProgress = progress)
    }

    showImage() {
        return true 
    }

    getImageUrl() {
        if(this.racemaps[this.racemapIndex]["imageChanged"]) {
            // show uploaded image
            return this.racemaps[this.racemapIndex]["tempUrl"]
        }
        return this.racemapsSvc.getImageUrl(this.racemaps[this.racemapIndex]) + "?" + this.imgRefreshNumber
    }
    
    onSelectionChanged() {
        this.isUploading = false
    }

    saveCurrentRacemap() {
        let self = this
        let racemap = this.racemaps[this.racemapIndex]
        let changed = racemap["imageChanged"]
        let file = racemap["tempFile"]
        this.racemapsSvc.saveRacemap(racemap).subscribe(
            (value) => {
                if(changed) {
                    this.isUploading = true
                    self.racemapsSvc.uploadRacemap(file, racemap.identifier).subscribe(() => {
                        racemap["imageChanged"] = false
                        this.isUploading = false
                        this.imgRefreshNumber += 1
                        this.notifications.success("Upload et sauvegarde effectués.")
                    },
                    (err) => {
                        this.isUploading = false
                        this.notifications.failure("Echec lors de l'upload de l'image.")
                    })
                } else {
                    this.notifications.success("Sauvegarde effectuée")
                }
            }, 
            (err) => {
                this.notifications.failure("Echec lors de la sauvegarde.")
            }
        )
    }

    onChangeFile(event : EventTarget) {
        let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
        let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
        let files: FileList = target.files;
        let racemap = this.racemaps[this.racemapIndex]
        racemap["imageChanged"] = true
        racemap["tempUrl"] = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(files.item(0)))
        racemap["tempFile"] = files.item(0)
    }

    hasCurrentRacemap() {
        return this.racemaps != null && this.racemaps[this.racemapIndex] != null
    }

    deleteCurrentRacemap() {
        let racemap = this.racemaps[this.racemapIndex]
        this.racemapsSvc.deleteRacemap(racemap).subscribe(
            (value) => {
                this.notifications.success("Carte supprimée.")
                if(value) this.loadRacemaps()
            }, 
            (err) => {
                this.notifications.success("Echec lors de la suppression.")
            }
        )
    }

    addNewRacemap() {
        let racemap = new RaceMap("Nouvelle carte", "URL", 0, 0, 0, 0)
        this.racemaps.push(racemap)
        this.racemapIndex = this.racemaps.length - 1
    }

    loadRacemaps() {
        var self = this
        this.racemapsSvc.loadRacemaps().subscribe((racemaps) => {
            this.racemaps = racemaps
            this.racemapIndex = Math.max(0, Math.min(this.racemapIndex, this.racemaps.length - 1))
        }, (err) => {
            this.notifications.failure("Erreur de connexion au serveur.", -1)
        })
    }
}