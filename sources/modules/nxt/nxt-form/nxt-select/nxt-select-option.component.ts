import { Component, ElementRef, Input, ViewEncapsulation } from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'

import { NxtSelectComponent } from '../'

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'nxt-select-option',
    styles: [],
    template: `
        <div class="nxt-option" (click)="select()" title="{{textContent}}">
            <ng-content></ng-content>
        </div>
    `,
})

export class NxtSelectOptionComponent {
    @Input() public value: string

    public textContent: string
    public elementRef: ElementRef

    private nxtSelectComponent: NxtSelectComponent
    private domSanitizer: DomSanitizer

    constructor (
    nxtSelectComponent: NxtSelectComponent,
    elementRef: ElementRef,
    domSanitizer: DomSanitizer,
    ) {
        this.value = ''
        this.nxtSelectComponent = nxtSelectComponent
        this.elementRef = elementRef
        this.domSanitizer = domSanitizer
    }

    public ngAfterViewInit () {
        setTimeout(() => {
            this.textContent = this.elementRef.nativeElement.querySelector('.nxt-option').textContent.trim().replace(/\s\s+/g, ' ')

            this.nxtSelectComponent.addOption(this)
        })
    }

    public select () {
        this.nxtSelectComponent.initChange(this)
    }

    public getInnerHTML (): SafeHtml {
        return this.domSanitizer.bypassSecurityTrustHtml(this.elementRef.nativeElement.querySelector('.nxt-option').innerHTML.trim())
    }
}
