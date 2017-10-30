import { Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core'

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'nxt-swiper',
    styles: [ require('./_nxt-swiper.component.scss') ],
    template: require('./_nxt-swiper.component.html'),
})

export class NxtSwiperComponent {
    @Input() public showBullets: boolean
    @Input() public showPrevNext: boolean
    @Input() public delay: number

    public _currentPos: number
    public elemsArray: number[]

    @Output() private onChange: EventEmitter<number>

    private elementRef: ElementRef
    private elem
    private interval
    private start: Date
    private end: Date
    private x: number
    private currentX: number
    private touchX: number
    private lastsTouchs: any
    private touching: boolean
    private scrolling: boolean
    private lastsMove: any

    constructor (elementRef: ElementRef) {
        this.showBullets = true
        this.showPrevNext = true
        this._currentPos = 1
        this.delay = 0

        this.elemsArray = []

        this.onChange = new EventEmitter<number>()

        this.elementRef = elementRef

        this.interval = null
        this.touching = false
        this.scrolling = false
        this.elem = null
        this.touchX = 0
        this.x = 0
        this.currentX = 0
        this.lastsMove = {
            new: 0,
            old: 0,
        }
        this.lastsTouchs = {
            new: 0,
            old: 0,
        }
        this.start = null
        this.end = null
    }

    public ngOnInit () {
        this.elem = this.elementRef.nativeElement.querySelector('.nxt-swiper-container')

        // Mouse events
        this.elem.addEventListener('mousedown', (e) => this.mousedown(e))

        // Touch events
        this.elem.addEventListener('touchstart', (e) => this.touchstart(e))
        this.elem.addEventListener('touchmove', (e) => this.touchmove(e))
        this.elem.addEventListener('touchend', (e) => this.touchend(e))

        if (this.delay > 0 && !isNaN(this.delay)) {
                this.interval = setInterval(() => {
                    if (this._currentPos < this.elemsArray.length) {
                        this.next()
                    } else {
                        this.goto(0)
                    }
                }, this.delay)
        }
    }

    public ngOnDestroy () {
        if (this.delay > 0 && !isNaN(this.delay)) {
            clearInterval(this.interval)
        }
    }

    @Input()
    set currentPos (value: number) {
        if (value <= this.elemsArray.length && this._currentPos !== value) {
            this.goto(value)
        } else if (this._currentPos !== value) {
            this._currentPos = value
        }
    }

    get currentPos () {
        return this._currentPos
    }

    /**
     * Go to the next element from event
     */
    public next () {
        if (this._currentPos < this.elemsArray.length) {
            this.x = this.currentX = -Math.abs(this._currentPos * 100)

            this._currentPos++

            this.move()
        } else {
            this.backToCurrent()
        }
    }

    /**
     * Do movement to previous element
     */
    public prev () {
        if (this._currentPos > 1) {
            this._currentPos--

            this.x = this.currentX = -Math.abs((this._currentPos - 1) * 100)

            this.move()
        } else {
            this.backToCurrent()
        }
    }

    /**
     * Go to element from position 1 to n element from event
     * @param {number} pos position of the element
     */
    public goto (pos) {
        this._currentPos = pos

        this.x = this.currentX = -Math.abs((this._currentPos - 1) * 100)

        this.move()
    }

    /**
     * Adding element from nxtSwipElem chlidren
     */
    public addElem () {
        if (this.elem.querySelectorAll('nxt-swip-elem').length > this.elemsArray.length) {
            this.elemsArray.push(this.elemsArray.length + 1)

            if (this.elemsArray.length === this._currentPos) {
                this.goto(this._currentPos)
            }
        }
    }

    /**
     * Removing element from nxtSwipElem chlidren
     */
    public removeElem () {
        this.elemsArray.pop()
    }

    /**
     * Mousedown event : when click on the element
     * @param {object} e event object
     */
    private mousedown (e) {
        e.preventDefault()

        let drag: boolean = true
        let moved: number = 0

        // start timer, begin drag and take mouse x coorditates
        this.start = new Date()
        let mouseX = e.pageX

        window.addEventListener('mousemove', mousemove)
        window.addEventListener('mouseup', mouseup)

        if (this.delay && !isNaN(this.delay)) {
            clearInterval(this.interval)
        }

        ///////////////

        const self = this

        /**
         * Mousemove event : when moving the mouse on the window after clickin on the element
         * @param {object} e event object
         */
        function mousemove (evt) {
            if (drag) {
                // Dragging the element
                if (self.x === self.currentX) {
                    self.x = -Math.abs((self._currentPos - 1) * self.elem.offsetWidth)
                }

                self.moveElem({ movementX: evt.pageX - mouseX })

                // Refresh element state
                moved++
                mouseX = evt.pageX
            }
        }

        /**
         * Mouseup event : when release the mouse after moving the element
         * @param   {object} e event object
         */
        function mouseup (evt) {
            drag = false

            if (moved > 1) {
                // If we have childen that are links we disable them
                [].forEach.call(self.elem.querySelectorAll('*'), (el, key) => {
                    el.onclick = (ev) => {
                        ev.stopPropagation()
                        ev.preventDefault()

                        return false
                    }
                })

                // movement ends
                moved = 0
                self.end = new Date()

                self.doMovement()
            } else {
                [].forEach.call(self.elem.querySelectorAll('*'), (el, key) => {
                    el.onclick = () => {
                        return true
                    }
                })
            }

            // We remove window event because we don't need it anymore
            window.removeEventListener('mousemove', mousemove)
            window.removeEventListener('mouseup', mouseup)

            if (self.delay && !isNaN(self.delay)) {
                self.interval = setInterval(() => self.next(), self.delay)
            }
        }
    }

    /**
     * Touchstart event : when touching the element
     * @param {object} e event object
     */
    private touchstart (e) {
        this.start = new Date()
        this.touchX = e.changedTouches[0].pageX
        this.lastsTouchs.new = e.changedTouches[0].pageY

        if (this.delay && !isNaN(this.delay)) {
            clearInterval(this.interval)
        }
    }

    /**
     * Touchmove event : when moving the finger on the element
     * @param {object} e event object
     */
    private touchmove (e) {
        // If the element is moving for the first time we adding first coordinates
        if (!this.touching && !this.scrolling) {
            this.lastsTouchs.old = this.lastsTouchs.new
            this.lastsTouchs.new = e.changedTouches[0].pageY
        }

        // If the move is fast enough in x direction or if we already touching the element (and not scrolling)
        if (Math.abs(this.lastsTouchs.old - this.lastsTouchs.new) < 5 || (this.touching && !this.scrolling)) {
            this.touching = true

            // Convert % to px
            if (this.x === this.currentX) {
                this.x = -Math.abs((this._currentPos - 1) * this.elem.offsetWidth)
            }

            // Move element with the finger
            this.moveElem({ movementX: e.changedTouches[0].pageX - this.touchX })

            this.touchX = e.changedTouches[0].pageX
        } else if (!this.touching) {
            this.scrolling = true
        }

        // If we're not scrolling we prevent default actions
        if (!this.scrolling) {
            e.preventDefault()
        }
    }

    /**
     * Touchend event : when release the element
     * @param {object} e event object
     */
    private touchend (e) {
        if (this.touching) {
            this.end = new Date()
            this.doMovement()
        }

        this.touching = false
        this.scrolling = false
        this.lastsTouchs.old = 0
        this.lastsTouchs.new = 0

        if (this.delay && !isNaN(this.delay)) {
            this.interval = setInterval(() => this.next(), this.delay)
        }
    }

    /**
     * Do the movement
     */
    private move () {
        this.elem.querySelector('.nxt-swiper-wrapper').style.transitionDuration =  '200ms'
        this.elem.querySelector('.nxt-swiper-wrapper').style.transform = 'translate3d(' + this.x + '%, 0px, 0px)'

        setTimeout(() => {
            this.elem.querySelector('.nxt-swiper-wrapper').style.transitionDuration =  '0ms'
        }, 300)

        this.onChange.emit(this._currentPos)
    }

    /**
     * Do movement to current element
     */
    private backToCurrent () {
        this.x = this.currentX
        this.move()
    }

    /**
     * Finalize movement left or right
     */
    private doMovement () {
        const movement = this.x + ((this._currentPos - 1) * this.elem.offsetWidth)
        const time = this.end.getTime() - this.start.getTime()

        if (movement < 0 && (Math.abs(movement) > this.elem.offsetWidth / 2 || time < 200)) {
            this.next()
        } else if (movement > 0 && (movement > this.elem.offsetWidth / 2 || time < 200)) {
            this.prev()
        } else {
            this.backToCurrent()
        }
    }

    /**
     * Move the element while the cursor moving
     * @param {object} e movement
     */
    private moveElem (o) {
        this.lastsMove.old = this.lastsMove.new
        this.lastsMove.new = o.movementX

        this.x += o.movementX

        this.elem.querySelector('.nxt-swiper-wrapper').style.transform = 'translate3d(' + this.x + 'px, 0px, 0px)'
    }
}
