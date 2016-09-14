import { ComponentResolver, Inject, Injectable, ReflectiveInjector, ViewContainerRef, provide } from '@angular/core'
import { DomSanitizationService } from '@angular/platform-browser'

import { NxtTooltipComponent } from './'

@Injectable()

export class NxtTooltipService {
    private componentResolver: ComponentResolver
    private domSanitizationService: DomSanitizationService

    constructor (
        @Inject(ComponentResolver) componentResolver,
        domSanitizationService: DomSanitizationService
    ) {
        this.componentResolver = componentResolver
        this.domSanitizationService = domSanitizationService
    }

    public pop (viewContainerRef: ViewContainerRef, content: string, el: HTMLElement, position: string) {
        const index = viewContainerRef.length

        return this.componentResolver
            .resolveComponent(NxtTooltipComponent)
            .then((factory) => {
                const childInjector = ReflectiveInjector.resolve([
                    provide('content', { useValue: this.domSanitizationService.bypassSecurityTrustHtml(content) }),
                    provide(HTMLElement, { useValue: el }),
                    provide('position', { useValue: position }),
                ])
                const injector = ReflectiveInjector.fromResolvedProviders(childInjector, viewContainerRef.injector)

                viewContainerRef.createComponent(factory, index, injector)

                return viewContainerRef.get(index)
            })
    }

    public close (viewContainerRef: ViewContainerRef, viewRef) {
        const index =  viewContainerRef.indexOf(viewRef)

        if (index > -1) {
            viewContainerRef.remove(index)
        }
    }
}
