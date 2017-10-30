import { Component, ElementRef, EventEmitter, Output, ViewEncapsulation } from '@angular/core'

@Component({
    encapsulation: ViewEncapsulation.None,
    host: {
        '(document:click)': 'onClick($event)',
    },
    selector: 'nxt-dropdown',
    styles: [
        require('./_nxt-dropdown.component.scss'),
    ],
    template: `
        <div class="nxt-dropdown-container">
            <div class="nxt-dropdown-title-container" (click)="open()">
                <ng-content select=".nxt-dropdown-title"></ng-content>
            </div>

            <div [hidden]="!showItems" class="nxt-dropdown-items">
                <ng-content select="nxt-dropdown-item"></ng-content>
            </div>
        </div>
    `,
})

export class NxtDropdownComponent {
    public showItems: boolean

    @Output() private onToggle: EventEmitter<boolean>

    private elementRef: ElementRef

    constructor (
        elementRef: ElementRef,
    ) {
        this.showItems = false
        this.onToggle = new EventEmitter<boolean>()
        this.elementRef = elementRef
    }

    public open () {
        this.showItems = !this.showItems

        this.onToggle.emit(this.showItems)
    }

    public onClick (event) {
        const target = event.path !== undefined ? event.path[0] : event.target
        const dropdown = this.elementRef.nativeElement.querySelector('.nxt-dropdown-title-container')
        const dropdownItems = this.elementRef.nativeElement.querySelector('.nxt-dropdown-items')

        if (!dropdown.contains(target) && !dropdownItems.contains(target)) {
            this.showItems = false
        }
    }
}
