import { ApplicationRef, ComponentFactoryResolver, Inject, Injectable, ReflectiveInjector, ValueProvider, ViewContainerRef } from '@angular/core'

import { EventsService } from '../../../helpers'
import { NxtToastContainerComponent } from './'

@Injectable()

export class NxtToastService extends EventsService {

    private viewRootContainerRef: ViewContainerRef

    constructor (
        @Inject(ComponentFactoryResolver) private componentResolver,
        private applicationRef: ApplicationRef,
    ) {
        super()
        // this.viewRootContainerRef = applicationRef['_rootComponents'][0]['_component'].viewContainerRef
        // this.viewRootContainerRef = injector.get(applicationRef.componentTypes[0]).viewContainerRef
    }

    public pop (content: string, duration: number, className: string = ''): Promise<boolean> {
        if (!this.viewRootContainerRef) {
            this.viewRootContainerRef = this.applicationRef['_rootComponents'][0]['_component'].viewContainerRef
        }

        if (document.querySelectorAll('nxt-toast-container').length === 0) {
            const index = this.viewRootContainerRef.length

            const toast = this.componentResolver.resolveComponentFactory(NxtToastContainerComponent)
            const toastServiceInstance: ValueProvider = { provide: NxtToastService, useValue: this }
            const childInjector = ReflectiveInjector.resolve([ toastServiceInstance ])
            const injector = ReflectiveInjector.fromResolvedProviders(childInjector, this.viewRootContainerRef.injector)
            this.viewRootContainerRef.createComponent(toast, index, injector)
        }

        return new Promise((resolve, reject) => {
            this.dispatch('add', content, duration, className)

            resolve(true)
        })
    }

    public close (viewRef) {
        const index =  this.viewRootContainerRef.indexOf(viewRef)

        if (index > -1) {
            this.viewRootContainerRef.remove(index)
        }
    }
}
