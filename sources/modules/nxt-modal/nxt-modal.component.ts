import { ElementRef, Inject, ViewContainerRef, ViewEncapsulation } from '@angular/core'

import { DynamicComponent, EventsService } from '../../helpers'
import { NxtModalService } from './'

export function nxtModalFactory (directives: any[], content: string, className: string = ''): any {
    return DynamicComponent.create({
        directives: directives,
        encapsulation: ViewEncapsulation.None,
        selector: 'nxt-modal',
        styles: [
            require('./_nxt-modal.component.scss'),
        ],
        template: `
            <div class="nxt-modal-overlay ${className}" (click)="close()">
                <div class="nxt-modal-container">
                    <div class="nxt-modal-header">
                        <h4 class="nxt-modal-title">{{title}}</h4>
                        <button type="button" class="nxt-modal-close-btn fa fa-times" (click)="close()"></button>
                    </div>
                    <div class="nxt-modal-content">
                        ${content}
                    </div>
                </div>
            </div>
        `,
    }, NxtModalComponent)
}

class NxtModalComponent {
    public title: string
    public context: any

    private index: number
    private viewContainerRef: ViewContainerRef
    private eventsService: EventsService
    private nxtModalService: NxtModalService
    private elementRef: ElementRef

    constructor (
        @Inject('title') title: string,
        @Inject('context') context: any,
        @Inject('index') index: number,
        @Inject('viewContainerRef') viewContainerRef: ViewContainerRef,
        @Inject(EventsService) eventsService: EventsService,
        @Inject('NxtModalService') nxtModalService: NxtModalService,
        elementRef: ElementRef
    ) {
        this.title = title
        this.context = context
        this.index = index
        this.viewContainerRef = viewContainerRef
        this.eventsService = eventsService
        this.nxtModalService = nxtModalService
        this.elementRef = elementRef
    }

    public ngOnInit () {
        this.elementRef.nativeElement.querySelector('.nxt-modal-container').addEventListener('click', (e) => e.stopPropagation())

        this.eventsService.on(this, 'nxtModalUpdateContext', (el, ctx) => {
            if (this.viewContainerRef.get(this.index) === el) {
                this.context = ctx
            }
        })

        this.eventsService.on(this, 'nxtModalUpdateTitle', (el, t: string) => {
            if (this.viewContainerRef.get(this.index) === el) {
                this.title = t
            }
        })
    }

    public ngOnDestroy () {
        this.eventsService.unsubscribe('nxtModalUpdateContext', this)
        this.eventsService.unsubscribe('nxtModalUpdateTitle', this)
    }

    public close () {
        this.nxtModalService.close(this.viewContainerRef, this.viewContainerRef.get(this.index))
    }
}
