import { Component, Input, ViewChild, ElementRef }  from '@angular/core';
import { ActivatedRoute }                           from '@angular/router'
import { Http, Response }                           from '@angular/http';
import { Observable }                               from 'rxjs/Observable';
import { RegatasService }                           from '../services/regatas.service'
import { RaceService }                              from '../services/race.service'
import { Regata, Race, Racer, TimePoint, Point }    from '../services/server-model'
import * as $ from 'jquery'

interface DeviceOption {
    color: string
    show: boolean
}

@Component({
    selector: 'race-player',
    templateUrl: 'app/components/race-player.template.html'
})
export class RacePlayerComponent  {
    @Input("race") race : Race;
    @ViewChild("mapCanvasContainer") mapCanvasContainer : ElementRef;
    @ViewChild("mapCanvas") mapCanvas: ElementRef;
    @ViewChild("mapImg") mapImg: ElementRef;

    public currentTime : number = 0 
    public showTrajectory : boolean = true
    public devicesOptions : { [devId : string] : DeviceOption } = null


    constructor(private http : Http, private raceSvc : RaceService) {
        window.addEventListener("resize", () => this.resizeCanvas())
    }
    
    toogleShowTrajectory() : void {
        this.showTrajectory = !this.showTrajectory
    }

    showAllDevices() : void {
        for(let devId in this.devicesOptions) {
            this.devicesOptions[devId].show = true
        }
    }

    getDevices() : string[] {
        let devices : string[] = []
        for(let key in this.devicesOptions) {
            devices.push(key)
        }
        return devices
    }

    getRacer(devId : string) : Racer {
        return this.raceSvc.race.concurrents.find((racer : Racer) => {
            return racer.device === devId
        })
    }


    getDeviceOpts(devId : string) : DeviceOption {
        return this.devicesOptions[devId]
    }

    hideAllDevices() : void {
        for(let devId in this.devicesOptions) {
            this.devicesOptions[devId].show = false
        }
    }

    /* ------------------------------------------------------
     * API
     * ----------------------------------------------------*/
    getLakeImageUrl() : String {
        if(this.raceSvc.raceMap == undefined) {
            return ""
        }
        return "app/static/" + this.raceSvc.raceMap.raceMapImageUrl
    }

    /* ------------------------------------------------------
     * Angular hooks
     * ----------------------------------------------------*/
    ngOnInit() {
        setInterval(() => this.canvasUpdate(), 1000.0/30)
        setTimeout(() => this.resizeCanvas(), 500)
        this.resizeCanvas()
        this.raceSvc.race = this.race
    }

    /* ------------------------------------------------------
     * Canvas Drawing 
     * ----------------------------------------------------*/
    randomRGB() {
        return Math.round(Math.random() * 255)
    }
    randomColor(seed : number) {
        return "rgb("   + this.randomRGB() + "," 
                        + this.randomRGB() + ","
                        + this.randomRGB() + ")"
    }

    canvasUpdate() : void {
        let img = this.mapImg.nativeElement
        let context: CanvasRenderingContext2D = this.mapCanvas.nativeElement.getContext("2d")
        let w = context.canvas.width
        let h = context.canvas.height
        let max = 1024

        // Draw background image
        context.fillStyle = 'white'
        context.fillRect(0, 0, w, h)
        context.fillStyle = 'white'
        context.globalAlpha = 0.2
        context.drawImage(
            img, 0, 0,
            w, h)
        
        context.globalAlpha = 1
        for(let checkpoint of this.raceSvc.race.buoys) {
            context.fillStyle = 'red'
            let x = (checkpoint.x / max) * w
            let y = (checkpoint.y / max) * h 
            context.fillRect(x, y, 5, 5)
        }

        this.currentTime += 0.2
        
        if(this.raceSvc.raceData.rawData != null && this.devicesOptions == null) {
            this.devicesOptions = {}
            for(let devId in this.raceSvc.raceData.rawData) {
                this.devicesOptions[devId] = {
                    show: true,
                    color: this.randomColor(0)
                }
            }
        }

        // Draw one concurrent racetype
        context.fillStyle = 'white'
        for(let devId in this.raceSvc.raceData.rawData) {
            // Show / Hide
            if(!this.devicesOptions[devId].show)
                continue
            
            // Points of the trajectory
            let pts : TimePoint[] = this.raceSvc.raceData.rawData[devId]

            // DEBUG
            this.currentTime %= pts[pts.length - 1].t
            

            if(this.showTrajectory) {
                context.beginPath();   
                context.moveTo(pts[0].x, pts[0].y);
            }

            context.fillStyle = this.devicesOptions[devId].color
            context.strokeStyle = this.devicesOptions[devId].color
            for(let pt of pts) {
                let isAfter = pt.t >= this.currentTime
                
                if(!this.showTrajectory && !isAfter)
                    continue
                
                let x = (pt.x / max) * w
                let y = (pt.y / max) * h 

                if(this.showTrajectory)
                    context.lineTo(x, y)
                context.fillRect(x, y, 2, 2)

                if(isAfter)
                    break;
            }

            if(this.showTrajectory)
                context.stroke();

        }
    }

    /* ------------------------------------------------------
     * Canvas Resize 
     * ----------------------------------------------------*/
    resizeCanvas() : void
    {
        let img : HTMLImageElement = this.mapImg.nativeElement
        let container : HTMLDivElement = this.mapCanvasContainer.nativeElement
        let canvas : HTMLCanvasElement = this.mapCanvas.nativeElement

        let ratio = 1.0 * img.naturalWidth / img.naturalHeight
        let w = container.clientWidth
        let h = container.clientWidth / ratio
        canvas.style.width = String(w) + "px"
        canvas.style.height= String(h) + "px"
        canvas.width  = w
        canvas.height = h
    }
}

