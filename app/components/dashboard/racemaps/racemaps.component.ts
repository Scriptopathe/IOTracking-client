import { Component, Input, ViewChild, ElementRef,
         EventEmitter, Output }                     from '@angular/core'
import { Http, Response }                           from '@angular/http'
import { Observable }                               from 'rxjs/Observable'
import { DomSanitizer, SafeHtml,SafeUrl,SafeStyle } from '@angular/platform-browser'
import { RacemapsService }                          from '../../../services/racemaps.service'
import { RaceMap, Server }                          from '../../../services/server-model'
@Component({
    selector: 'racemaps',
    templateUrl: 'app/components/dashboard/racemaps/racemaps.template.html'
})

export class RacemapsComponent  {
    selectedFile : File
    racemaps : RaceMap[]
    racemapIndex : number
    error : string
    
    isUploading : boolean
    uploadProgress : number
    imageChanged : boolean

    constructor(private sanitizer : DomSanitizer, private racemapsSvc : RacemapsService) {        
        this.loadRacemaps()
        this.racemapIndex = 0
        this.error = null
        this.imageChanged = false
        this.racemapsSvc.progress.subscribe((progress) => this.uploadProgress = progress)
    }

    showImage() {
        return true 
        /* this.hasCurrentRacemap() && 
            !(this.racemaps[this.racemapIndex].identifier == null && !this.imageChanged) */
    }

    getImageUrl() {
        if(this.imageChanged) {
            // show uploaded image
            console.log("image changed")
            return ""
        }
        return Server.RaceMapImagesUrl + "/" + this.racemaps[this.racemapIndex].identifier
    }
    
    saveCurrentRacemap() {
        let self = this
        let racemap = this.racemaps[this.racemapIndex]
        this.racemapsSvc.saveRacemap(racemap).subscribe(
            (value) => {
                this.isUploading = true
                self.racemapsSvc.uploadRacemap(this.selectedFile, racemap.identifier).subscribe(() => {
                    this.isUploading = false
                }, 
                (err) => {
                    this.error = err
                    this.isUploading = false
                })
            }, 
            (err) => {
                this.error = err
            }
        )
    }

    onChangeFile(event : EventTarget) {
        let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
        let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
        let files: FileList = target.files;
        this.selectedFile = files.item(0)
        this.imageChanged = true
    }

    hasCurrentRacemap() {
        return this.racemaps != null && this.racemaps[this.racemapIndex] != null
    }

    deleteCurrentRacemap() {
        let racemap = this.racemaps[this.racemapIndex]
        this.racemapsSvc.deleteRacemap(racemap).subscribe(
            (value) => {
                if(value) this.loadRacemaps()
            }, 
            (err) => {
                this.error = err
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
            this.error = null
        })
    }
}