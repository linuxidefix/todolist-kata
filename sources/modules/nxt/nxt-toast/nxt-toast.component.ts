import { Component, ElementRef, Input, ViewEncapsulation } from '@angular/core'

import { NxtToastService } from './'

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'nxt-toast',
    styles: [],
    template: `
        <div class="nxt-toast-container {{ className }}" [ngClass]="{'shown': shown}">
            <span class="nxt-toast-text-content">{{ content | translate }}</span>
            <button type="button" class="nxt-toast-close fa fa-times-circle" (click)="close()"></button>
        </div>
    `,
})

export class NxtToastComponent {
    public shown: boolean

    @Input() public content: string
    @Input() public className: string
    @Input() private duration: number
    @Input() private id: number

    private timeout: any
    private elementRef: ElementRef
    private nxtToastService: NxtToastService

    constructor (nxtToastService: NxtToastService, elementRef: ElementRef) {
        this.shown = false

        this.content = ''
        this.className = ''
        this.duration = 5000

        this.timeout = null
        this.elementRef = elementRef
        this.nxtToastService = nxtToastService
    }

    public ngOnInit () {
        setTimeout(() => {
            this.shown = true

            this.timeout = setTimeout(() => {
                this.close()
            }, this.duration)
        }, 100)
    }

    public close () {
        this.shown = false

        clearTimeout(this.timeout)

        setTimeout(() => {
            this.nxtToastService.dispatch('remove', this.id)
        }, 300)
    }
}
