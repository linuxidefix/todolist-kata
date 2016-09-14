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
    private viewRootContainerRef: ViewContainerRef
    private viewRef: ViewRef
    private nxtTooltipService: NxtTooltipService

    constructor (
        el: ElementRef,
        applicationRef: ApplicationRef,
        injector: Injector,
        nxtTooltipService: NxtTooltipService
    ) {
        this.el = el.nativeElement
        this.viewRootContainerRef = injector.get(applicationRef.componentTypes[0]).viewContainerRef
        this.nxtTooltipService = nxtTooltipService
        this.index = 0
    }

    @HostListener('mouseenter') public onMouseEnter () {
        this.nxtTooltipService.pop(this.viewRootContainerRef, this.content, this.el, this.position)
            .then(viewRef => {
                this.viewRef = viewRef
            })
    }

    @HostListener('mouseleave') public onMouseLeave () {
        this.nxtTooltipService.close(this.viewRootContainerRef, this.viewRef)
    }
}
