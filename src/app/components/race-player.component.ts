import { Component, Input, ViewChild, ElementRef,
         SimpleChange }                             from '@angular/core';
import { ActivatedRoute }                           from '@angular/router'
import { Http, Response }                           from '@angular/http'
import { Observable }                               from 'rxjs/Observable'
import { RegatasService }                           from '../services/regatas.service'
import { RaceService }                              from '../services/race.service'
import { RacemapsService }                          from '../services/racemaps.service'
import { Regata, Race, Racer,
         TimePoint, Point, FullRace }               from '../services/server-model'

import * as $ from 'jquery'

interface DeviceOption {
    color: string
    show: boolean
}

@Component({
    selector: 'race-player',
    templateUrl: './race-player.template.html',
})
export class RacePlayerComponent  {
    @ViewChild("mapCanvasContainer") mapCanvasContainer : ElementRef;
    @ViewChild("mapCanvas") mapCanvas: ElementRef;
    @ViewChild("mapImg") mapImg: ElementRef;
    @Input("race") race : Race
    @Input("live") live : boolean
    /* ------------------------------------------------------
     * Variables
     * ----------------------------------------------------*/
    // constants
    private frameDelta : number = 1000.0 / 30.0
    private liveRefreshInterval : number = 1000.0 // seconds
    
    // data
    private fullRace : FullRace = null

    // player options
    public currentTime : number = 0 // in seconds
    public showTrajectory : boolean = true
    public devicesOptions : { [devId : string] : DeviceOption } = null
    public isPlaying : boolean = true
    public speed : number = 1 // 1x realtime

    // refresh interval to be cleared at the end of the components
    private _refreshInterval : any
    /* ------------------------------------------------------
     * Properties
     * ----------------------------------------------------*/
    ngOnChanges(changes: {[ propName: string]: SimpleChange}) {
        var self = this
        console.dir(changes)
        if("race" in changes && this.race != null) {
            this.raceSvc.loadRaceData(this.race).subscribe((fullRace) => {
                this.fullRace = fullRace
                this.currentTime = this.getMinTime()
            })
        } else if("live" in changes && this.race != null) {
            this._refreshInterval = setInterval(function() {
                self.refreshLiveData();
            }, this.liveRefreshInterval)
        }
    }

    ngOnDestroy() {
        if(this._refreshInterval) clearInterval(this._refreshInterval)
    }

    refreshLiveData() {
        this.raceSvc.loadRaceData(this.race).subscribe((fullRace) => {
            this.fullRace = fullRace
        })
    }
    /* ------------------------------------------------------
     * Constructor
     * ----------------------------------------------------*/
    constructor(private http : Http, private raceSvc : RaceService,
                private racemapsSvc : RacemapsService) {
        this.live = false
        window.addEventListener("resize", () => this.resizeCanvas())
    }

    /* ------------------------------------------------------
     * Methods
     * ----------------------------------------------------*/   
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
        return this.fullRace.concurrents.find((racer : Racer) => {
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

    zeroFill(n : number) : string {
        if(n == undefined) n = 0
        return ('0000'+n).slice(-2);
    }

    getTimeString(timeInSeconds : number) : string {
        // 1h 34′ 56″
        let seconds = this.zeroFill(Math.floor(timeInSeconds % 60))
        let minutes = this.zeroFill(Math.floor((timeInSeconds % (60 * 60)) / 60))
        let hours = this.zeroFill(Math.floor((timeInSeconds) / (60 * 60)))
        return hours + "h " + minutes + "' " + seconds + "\""
    }

    speedUp() {
        this.speed *= 2
    }

    speedDown() {
        this.speed = Math.max(1, this.speed / 2)
    }

    /* ------------------------------------------------------
     * API
     * ----------------------------------------------------*/
    getLakeImageUrl() : String {
        if(this.fullRace == undefined) {
            return ""
        }
        return this.racemapsSvc.getImageUrl(this.fullRace.map)
    }

    /* ------------------------------------------------------
     * Angular hooks
     * ----------------------------------------------------*/
    ngOnInit() {
        setInterval(() => this.canvasUpdate(), this.frameDelta)
        setTimeout(() => this.resizeCanvas(), 500)
        this.resizeCanvas()
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

    getMaxTime() : number {
        if(this.fullRace == undefined)
            return 100
        
        let maxTime = 0
        for(let devId in this.fullRace.data.rawData) {
            maxTime = Math.max(maxTime,  this.fullRace.data.rawData[devId][this.fullRace.data.rawData[devId].length - 1].t)
        }
        return maxTime
    }

    getMinTime() : number {
        if(this.fullRace == undefined)
            return 0
        
        let minTime = Number.MAX_VALUE
        for(let devId in this.fullRace.data.rawData) {
            minTime = Math.min(minTime,  this.fullRace.data.rawData[devId][0].t)
        }
        return minTime
    }

    getTime() : number {
        return this.currentTime - this.getMinTime()
    }
    /** 
     * Transforms GPS coordinates (0-1024) to relative screen coordinates (between 0 and 1)
     *          x: longitude (min = west, max = east)
     *          y: latitude (min = south, max = west)
     * 
     * 
     * This approximation is good for small areas only ! 
     */
    gpsToCartesian(gpsCoords : Point) : Point {
        let maxValue = 1023 // 10 bits
        let map = this.fullRace.map

        return {
            x: gpsCoords.x / maxValue,
            y: 1 - (gpsCoords.y / maxValue) // inversion between screen coordinates and gps coordinates
            //x: ((gpsCoords.x - map.westLongReference)/((map.eastLongReference - map.westLongReference))),
            //y: (1 - ((gpsCoords.y - map.southLatReference)/(map.northLatReference - map.southLatReference)))
        }
    }

    /**
     * As the buoys are raw GPS coordinates, we need to convert them.
     */
    buoyToCartesian(buoyCoord : Point) {
        let map = this.fullRace.map
        return this.gpsToCartesian({
            x: ((buoyCoord.x - map.westLongReference)/((map.eastLongReference - map.westLongReference))),
            y: (1 - ((buoyCoord.y - map.southLatReference)/(map.northLatReference - map.southLatReference)))
        })
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
        

        // Update time
        if(this.isPlaying) {
            this.currentTime += this.speed * this.frameDelta / 1000.0
            if(this.currentTime > this.getMaxTime()) {
                this.currentTime = this.getMaxTime()
            }
        }

        if(this.fullRace == null)
            return
        
        // Draws checkpoints
        context.globalAlpha = 1
        for(let checkpoint of this.fullRace.buoys) {
            let xy = this.buoyToCartesian(checkpoint)
            context.fillStyle = 'red'
            let x = xy.x * w
            let y = xy.y * h 
            context.fillRect(x, y, 5, 5)
        }

        
        // Initialize device options
        if(this.fullRace.data.rawData != null && this.devicesOptions == null) {
            this.devicesOptions = {}
            for(let devId in this.fullRace.data.rawData) {
                this.devicesOptions[devId] = {
                    show: true,
                    color: this.randomColor(0)
                }
            }
        }

        // Draw one concurrent racetype
        context.fillStyle = 'white'
        for(let devId in this.fullRace.data.rawData) {
            // Show / Hide
            if(!this.devicesOptions[devId].show)
                continue
            
            // Points of the trajectory
            let pts : TimePoint[] = this.fullRace.data.rawData[devId]
            
            if(this.showTrajectory) {
                let xy = this.gpsToCartesian(pts[0])
                let x = xy.x * w
                let y = xy.y * h 
                context.beginPath();   
                context.moveTo(x, y);
            }

            context.fillStyle = this.devicesOptions[devId].color
            context.strokeStyle = this.devicesOptions[devId].color
            for(let pt of pts) {
                let isAfter = pt.t >= this.currentTime
                
                if(!this.showTrajectory && !isAfter)
                    continue
                
                let xy = this.gpsToCartesian(pt)
                let x = xy.x * w
                let y = xy.y * h 

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