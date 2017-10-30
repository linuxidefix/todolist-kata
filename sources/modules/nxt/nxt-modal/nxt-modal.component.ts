import { Component, ComponentFactoryResolver, ElementRef, Inject, ReflectiveInjector, ValueProvider, ViewChild, ViewContainerRef, ViewEncapsulation, ViewRef } from '@angular/core'

import { EventsService } from '../../../helpers'

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'nxt-modal',
    styles: [
        require('./_nxt-modal.component.scss'),
    ],
    template: `
        <div class="nxt-modal-overlay" [ngClass]="className" (click)="close()">
            <div class="nxt-modal-container">
                <div class="nxt-modal-header">
                    <h4 class="nxt-modal-title">{{ title }}</h4>
                    <button type="button" class="nxt-modal-close-btn fa fa-times" (click)="close()"></button>
                </div>
                <div class="nxt-modal-content">
                    <div #nxtModalContent></div>
                </div>
            </div>
        </div>
    `,
})

export class NxtModalComponent {
    public title: string
    public className: string

    private content: any
    private context: any
    private viewContainerRef: ViewContainerRef
    private eventsService: EventsService
    private elementRef: ElementRef
    private componentResolver: ComponentFactoryResolver
    @ViewChild('nxtModalContent', { read: ViewContainerRef }) private nxtModalContent: ViewContainerRef
    private viewRef: ViewRef

    constructor (
        @Inject('title') title: string,
        @Inject('content') content: any,
        @Inject('context') context: any,
        @Inject('className') className: string,
        @Inject(EventsService) eventsService: EventsService,
        @Inject('viewContainerRef') viewContainerRef: ViewContainerRef,
        elementRef: ElementRef,
        componentResolver: ComponentFactoryResolver,
    ) {
        this.title = title
        this.content = content
        this.context = context
        this.className = className
        this.viewContainerRef = viewContainerRef
        this.eventsService = eventsService
        this.elementRef = elementRef
        this.componentResolver = componentResolver
    }

    public ngOnInit () {
        this.elementRef.nativeElement.querySelector('.nxt-modal-container').addEventListener('click', (e) => e.stopPropagation())

        this.eventsService.on(this, 'nxtModalUpdateTitle', (viewRef: ViewRef, t: string) => {
            if (this.viewRef === viewRef) {
                this.title = t
            }
        })
    }

    public setViewRef (viewRef: ViewRef) {
        this.viewRef = viewRef

        const index = this.nxtModalContent.length

        const content = this.componentResolver.resolveComponentFactory(this.content)
        const providers: ValueProvider[] = [
            { provide: 'context', useValue: this.context },
            { provide: 'ViewRefModal', useValue: this.viewRef },
            { provide: 'viewContainerRef', useValue: this.viewContainerRef },
            { provide: EventsService, useValue: this.eventsService },
        ]
        const childInjector = ReflectiveInjector.resolve(providers)
        const injector = ReflectiveInjector.fromResolvedProviders(childInjector, this.nxtModalContent.injector)
        this.nxtModalContent.createComponent(content, index, injector)
    }

    public ngOnDestroy () {
        this.eventsService.unsubscribe('nxtModalUpdateTitle', this)
    }

    public close () {
        const index = this.viewContainerRef.indexOf(this.viewRef)
        this.viewContainerRef.remove(index)
    }
}
