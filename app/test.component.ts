import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Http, Response }   from '@angular/http';
import { TestService }      from './test.service';
import { Observable }       from 'rxjs/Observable';
import { Lake }             from './test.service';

// import 'rxjs/Rx';
import 'rxjs/add/operator/map'

@Component({
    selector: 'this-is-test',
    providers: [TestService],
    template: `
    <img style="display: none" #mapImg [src]="getLakeImageUrl()"/>
    <div #mapCanvasContainer class="container">
            <canvas style="display: block" #mapCanvas></canvas>
    </div>`
})

export class TestComponent  { 
    testString: String = "Default test string"
    testNumber: number = 0
    imageFile: String = ""
    data : Observable<any>

    @ViewChild("mapCanvasContainer") mapCanvasContainer : ElementRef;
    @ViewChild("mapCanvas") mapCanvas: ElementRef;
    @ViewChild("mapImg") mapImg: ElementRef;

    constructor(private testService : TestService, private http : Http) {
        window.addEventListener("resize", () => this.resizeCanvas())

        this.testNumber = 0
        this.testService.loadLakes(this.http)
        
    }
    
    /* ------------------------------------------------------
     * API
     * ----------------------------------------------------*/
    getLake() : Lake {
        if(this.testService.lakes != null)
            return this.testService.lakes[0]
        else
            return null
    }

    getLakeImageUrl() : String {
        let lake : Lake = this.getLake()
        if(lake != null)
            return "app/static/" + lake.background
        else
            return ""
    }

    /* ------------------------------------------------------
     * Angular hooks
     * ----------------------------------------------------*/
    ngOnInit() {
        setInterval(() => this.canvasUpdate(), 1000.0/30)
        setTimeout(() => this.resizeCanvas(), 500)
        this.resizeCanvas()
    }

    /* ------------------------------------------------------
     * Canvas Drawing 
     * ----------------------------------------------------*/
    canvasUpdate() : void {
        this.testNumber += 1

        let img = this.mapImg.nativeElement
        let context: CanvasRenderingContext2D = this.mapCanvas.nativeElement.getContext("2d")
        let w = context.canvas.width
        let h = context.canvas.height
        
        context.fillStyle = 'gray'
        context.fillRect(0, 0, w, h)
        context.fillStyle = 'blue'
        context.fillRect(10, 10, 110, 110)
        context.fillStyle = 'white'
        if(this.testService.lakes != null) {
            context.drawImage(
                img, 0, 0,
                w, h)
            context.fillText(this.testService.lakes[0].background, 20, 20);

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