import { ApplicationRef, Directive, ElementRef, HostListener, Injector, Input, ViewContainerRef, ViewRef } from '@angular/core'

import { NxtTooltipService } from './'

@Directive({
    providers: [NxtTooltipService],
    selector: '[nxtTooltip]',
})

export class NxtTooltipDirective {
    @Input('nxtTooltip') private content: string
    @Input('nxtTooltipPosition') private position: string // (top|right|bottom|left|middle)

    private el: HTMLElement
    private index: number
    private viewRef: ViewRef = null
    private nxtTooltipService: NxtTooltipService
    private _hide: boolean = false

    constructor (
        el: ElementRef,
        applicationRef: ApplicationRef,
        injector: Injector,
        nxtTooltipService: NxtTooltipService,
    ) {
        this.el = el.nativeElement
        this.nxtTooltipService = nxtTooltipService
        this.index = 0
    }

    @Input('nxtTooltipHide')
    set hide (hide: boolean) {
        this._hide = hide

        if (hide) {
            this.onMouseLeave()
        }
    }

    get hide () {
        return this._hide
    }

    @HostListener('mouseenter')
    public onMouseEnter () {
        if (this.viewRef !== null) {
            this.onMouseLeave()
        }

        if (!this._hide) {
            this.nxtTooltipService.pop(this.content, this.el, this.position)
                .then((viewRef) => {
                    this.viewRef = viewRef
                })
        }
    }

    @HostListener('mouseleave')
    public onMouseLeave () {
        if (this.viewRef !== null) {
            this.nxtTooltipService.close(this.viewRef)

            this.viewRef = null
        }
    }

    public ngOnDestroy () {
        this.onMouseLeave()
    }
}
