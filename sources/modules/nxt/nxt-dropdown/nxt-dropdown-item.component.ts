import { Component, ViewEncapsulation } from '@angular/core'

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'nxt-dropdown-item',
    styles: [],
    template: `
        <div class="nxt-dropdown-item">
            <ng-content></ng-content>
        </div>
    `,
})

export class NxtDropdownItemComponent {}
