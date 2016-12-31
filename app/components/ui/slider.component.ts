import { Component, Input, Output, 
         ViewChild, ElementRef, EventEmitter }      from '@angular/core';
import { ActivatedRoute }                           from '@angular/router'
import { Http, Response }                           from '@angular/http';
import { Observable }                               from 'rxjs/Observable';
import * as $ from 'jquery'

interface Rectangle {
    x: number
    y: number
    w: number
    h: number
}

interface Point {
    x: number
    y: number
}

@Component({
    selector: 'slider',
    templateUrl: 'app/components/ui/slider.template.html'
})
export class SliderComponent  {
    @ViewChild("sliderContainer") sliderCanvasContainer : ElementRef;
    @ViewChild("sliderCanvas") sliderCanvas: ElementRef;

    @Input("maxValue") public maxValue : number = 100
    @Input("minValue") public minValue : number = 0
    @Output()  private valueChange = new EventEmitter();
    public step : number = 1

    private _value: number = 50
    private _caretHover : boolean = false
    private _isSliding : boolean = false
    private _selectX : number
    private _selectY : number

    constructor() {
        window.addEventListener("resize", () => this.resizeCanvas())
    }
    

    /* ------------------------------------------------------
     * Properties
     * ----------------------------------------------------*/
    @Input("value")
    get value() { return this._value }
    set value(val) {
        if(val == undefined) val = this.minValue
        this._value = Math.max(this.minValue, Math.min(this.maxValue, val))
        this.valueChange.emit(this.value)
        this.canvasUpdate()
    }

    /* ------------------------------------------------------
     * Angular hooks
     * ----------------------------------------------------*/
    ngOnInit() {
        setTimeout(() => this.canvasUpdate(), 500)
        setTimeout(() => this.resizeCanvas(), 500)
        this.resizeCanvas()

        $(this.sliderCanvas.nativeElement).mousemove((e) => this.onMouseMove(e))
        $(this.sliderCanvas.nativeElement).mousedown((e) => this.onMouseDown(e))
        $(this.sliderCanvas.nativeElement).mouseup((e) => this.onMouseUp(e))
        $(this.sliderCanvas.nativeElement).ready(() => this.canvasUpdate())
    }


    onMouseMove(e: JQueryMouseEventObject) {
        this._caretHover = this.isInRect({x: e.offsetX, y: e.offsetY}, this.getCaretRect())
        if(this._isSliding) {
            // update the value
            let percent = e.offsetX / this.getCanvas().width
            this.value = this.minValue + percent * (this.maxValue - this.minValue)
        }
        this.canvasUpdate()
    }

    onMouseDown(e: JQueryMouseEventObject) {
        if(this._caretHover) {
            this._selectX = e.offsetX
            this._selectY = e.offsetY
            this._isSliding = true
        } else {
            // update the value
            let percent = e.offsetX / this.getCanvas().width
            this.value = this.minValue + percent * (this.maxValue - this.minValue)
        }
        this.canvasUpdate()
    }

    onMouseUp(e: JQueryMouseEventObject) {
        if(this._isSliding) {
            // Fire event

            this._isSliding = false
        }

        this.canvasUpdate()
    }
    /* ------------------------------------------------------
     * Canvas Drawing 
     * ----------------------------------------------------*/
    roundRect(ctx : CanvasRenderingContext2D, x : number, y : number, 
              width : number, height : number, radius : any, fill? : boolean, stroke? : boolean) {
        if (typeof stroke == 'undefined') {
            stroke = true;
        }
        if (typeof radius === 'undefined') {
            radius = 5;
        }
        if (typeof radius === 'number') {
            radius = {tl: radius, tr: radius, br: radius, bl: radius};
        } else {
            var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
            for (var side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }
        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();
        if (fill) {
            ctx.fill();
        }
        if (stroke) {
            ctx.stroke();
        }
    }

    getCaretRect() : Rectangle {
        let caretWidth = 10
        let percent = 1.0 * (this.value - this.minValue) / this.maxValue
        let posX = percent * this.getCanvas().width - caretWidth / 2
        return {
            x: posX,
            y: 0,
            w: caretWidth,
            h: this.getCanvas().height
        }
    }

    isInRect(pt : Point, rect : Rectangle) : boolean {
        return pt.x >= rect.x && pt.x <= rect.x + rect.w &&
               pt.y >= rect.y && pt.y <= rect.y + rect.h
    }

    canvasUpdate() : void {
        let context: CanvasRenderingContext2D = this.sliderCanvas.nativeElement.getContext("2d")
        let w = context.canvas.width
        let h = context.canvas.height

        // Draw background image
        context.clearRect(0, 0, w, h)

        // Draw horizontal line
        context.fillStyle = 'grey'
        context.fillRect(0, h/2, w, 1)

        // Draw caret
        let rect = this.getCaretRect()
        context.strokeStyle = "rgb(0, 125, 255)"
        if(this._caretHover)
            context.fillStyle = 'rgb(0, 125, 244)'
        else
            context.fillStyle = 'rgb(0, 25, 244)'

        this.roundRect(context, rect.x, rect.y, rect.w, rect.h, 5, true, true)
    }

    getCanvas() : HTMLCanvasElement {
        return this.sliderCanvas.nativeElement
    }

    /* ------------------------------------------------------
     * Canvas Resize 
     * ----------------------------------------------------*/
    resizeCanvas() : void
    {
        let container : HTMLDivElement = this.sliderCanvasContainer.nativeElement
        let canvas : HTMLCanvasElement = this.getCanvas()

        let w = container.clientWidth
        let h = container.clientHeight
        canvas.style.width = String(w) + "px"
        canvas.style.height= String(h) + "px"
        canvas.width = w
        canvas.height = h
    }
}

