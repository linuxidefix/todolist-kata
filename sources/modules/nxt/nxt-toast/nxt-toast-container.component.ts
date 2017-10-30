import { Component, Inject, ViewEncapsulation } from '@angular/core'

import { NxtToastService } from './'

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'nxt-toast-container',
    styles: [
        require('./_nxt-toast.component.scss'),
    ],
    template: `
        <div class="nxt-toast-list-container">
            <nxt-toast *ngFor="let t of toastList" [id]="t.id" [content]="t.content" [duration]="t.duration" [className]="t.className"></nxt-toast>
        </div>
    `,
})

export class NxtToastContainerComponent {
    public toastList: any[]

    constructor (@Inject(NxtToastService) nxtToastService: NxtToastService) {
        this.toastList = []

        nxtToastService.on(this, 'add', (content: string, duration: number, className: string) => {
            setTimeout(() => this.addToast(content, duration, className))
        })

        nxtToastService.on(this, 'remove', (id: number) => {
            this.toastList = this.toastList.filter((t) => t.id !== id)
        })
    }

    private addToast (content: string, duration: number = 5000, className: string = '') {
        const id = this.toastList.reduce((p, c) => p < c.id ? c.id : p, 0) + 1

        this.toastList.push({ className, content, duration, id })
    }
}
