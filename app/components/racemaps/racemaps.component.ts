import { Component, Input, ViewChild, ElementRef,
         EventEmitter, Output }                     from '@angular/core'
import { Http, Response }                           from '@angular/http'
import { Observable }                               from 'rxjs/Observable'
import { DomSanitizer, SafeHtml,SafeUrl,SafeStyle } from '@angular/platform-browser'
import { RacemapsService }                          from '../../services/racemaps.service'
import { RaceMap }                                  from '../../services/server-model'

@Component({
    selector: 'racemaps',
    templateUrl: 'app/components/racemaps/racemaps.template.html'
})

export class RacemapsComponent  { 
    racemaps : RaceMap[]
    racemapIndex : number
    error : string
    constructor(private sanitizer : DomSanitizer, private racemapsSvc : RacemapsService) {        
        this.loadRacemaps()
        this.racemapIndex = 0
        this.error = null
    }

    saveCurrentRacemap() {
        let racemap = this.racemaps[this.racemapIndex]
        this.racemapsSvc.saveRacemap(racemap).subscribe(
            (value) => {
                if(value) this.loadRacemaps()
            }, 
            (err) => {
                this.error = err
            }
        )
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