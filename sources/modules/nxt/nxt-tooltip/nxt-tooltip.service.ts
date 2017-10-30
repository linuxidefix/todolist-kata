import { ApplicationRef, ComponentFactoryResolver, Inject, Injectable, ReflectiveInjector, ValueProvider, ViewContainerRef, ViewRef } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'

import { NxtTooltipComponent } from './'

@Injectable()

export class NxtTooltipService {
    private componentResolver: ComponentFactoryResolver
    private domSanitizer: DomSanitizer
    private viewRootContainerRef: ViewContainerRef

    constructor (
        @Inject(ComponentFactoryResolver) componentResolver,
        domSanitizer: DomSanitizer,
        private applicationRef: ApplicationRef,
    ) {
        this.componentResolver = componentResolver
        this.domSanitizer = domSanitizer
    }

    public pop (content: string, el: HTMLElement, position: string): Promise<ViewRef> {
        if (!this.viewRootContainerRef) {
            this.viewRootContainerRef = this.applicationRef['_rootComponents'][0]['_component'].viewContainerRef
        }

        const tooltip = this.componentResolver.resolveComponentFactory(NxtTooltipComponent)
        const index = this.viewRootContainerRef.length

        const providers: ValueProvider[] = [
            { provide: 'content', useValue: this.domSanitizer.bypassSecurityTrustHtml(content) },
            { provide: HTMLElement, useValue: el },
            { provide: 'position', useValue: position },
        ]
        const childInjector = ReflectiveInjector.resolve(providers)
        const injector = ReflectiveInjector.fromResolvedProviders(childInjector, this.viewRootContainerRef.injector)

        this.viewRootContainerRef.createComponent(tooltip, index, injector)

        return new Promise((resolve, reject) => {
            resolve(this.viewRootContainerRef.get(index))
        })
    }

    public close (viewRef) {
        const index =  this.viewRootContainerRef.indexOf(viewRef)

        if (index > -1) {
            this.viewRootContainerRef.remove(index)
        }
    }
}
