import { ComponentResolver, Inject, Injectable, ReflectiveInjector, ViewContainerRef, ViewRef, provide } from '@angular/core'
import { DomSanitizationService } from '@angular/platform-browser'

import { EventsService } from '../../helpers'
import { nxtModalFactory } from './nxt-modal.component'

@Injectable()

export class NxtModalService {
    private componentResolver: ComponentResolver
    private domSanitizationService: DomSanitizationService

    constructor (
        @Inject(ComponentResolver) componentResolver,
        domSanitizationService: DomSanitizationService
    ) {
        this.componentResolver = componentResolver
        this.domSanitizationService = domSanitizationService
    }

    public pop (viewContainerRef: ViewContainerRef, title: string, directives: any[], content: string, context: any, eventsService: EventsService, className: string = '') {
        const index = viewContainerRef.length

        let modalComponent = nxtModalFactory(directives, content, className)

        return this.componentResolver
            .resolveComponent(modalComponent)
            .then((factory) => {
                const childInjector = ReflectiveInjector.resolve([
                    provide('title', { useValue: title }),
                    provide('context', { useValue: context }),
                    provide('index', { useValue: index }),
                    provide('viewContainerRef', { useValue: viewContainerRef }),
                    provide('NxtModalService', { useValue: this }),
                    provide(EventsService, { useValue: eventsService }),
                ])
                const injector = ReflectiveInjector.fromResolvedProviders(childInjector, viewContainerRef.injector)

                viewContainerRef.createComponent(factory, index, injector)

                return viewContainerRef.get(index)
            })
    }

    public close (viewContainerRef: ViewContainerRef, viewRef: ViewRef) {
        const index =  viewContainerRef.indexOf(viewRef)

        if (index > -1) {
            viewContainerRef.remove(index)
        }
    }
}
