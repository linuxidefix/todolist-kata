import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, ReflectiveInjector, ValueProvider, ViewContainerRef, ViewRef } from '@angular/core'

import { EventsService } from '../../../helpers'
import { NxtModalContentComponent } from './nxt-modal-content.component'
import { NxtModalComponent } from './nxt-modal.component'

@Injectable()

export class NxtModalService extends EventsService {

    private componentResolver: ComponentFactoryResolver
    private viewRootContainerRef: ViewContainerRef

    constructor (
        componentResolver: ComponentFactoryResolver,
        private applicationRef: ApplicationRef,
    ) {
        super()

        this.componentResolver = componentResolver
    }

    public pop (title: string, content: any, context: any, className: string = ''): Promise<ViewRef> {
        if (!(content.prototype instanceof NxtModalContentComponent)) {
            throw new Error('Component class must extends NxtModalContentComponent')
        }

        if (!this.viewRootContainerRef) {
            this.viewRootContainerRef = this.applicationRef['_rootComponents'][0]['_component'].viewContainerRef
        }

        const modal = this.componentResolver.resolveComponentFactory(NxtModalComponent)
        const providers: ValueProvider[] = [
            { provide: 'title', useValue: title },
            { provide: 'content', useValue: content },
            { provide: 'context', useValue: context },
            { provide: 'className', useValue: className },
            { provide: 'viewContainerRef', useValue: this.viewRootContainerRef },
            { provide: 'nxtModalService', useValue: this },
            { provide: EventsService, useValue: this },
        ]
        const childInjector = ReflectiveInjector.resolve(providers)
        const injector = ReflectiveInjector.fromResolvedProviders(childInjector, this.viewRootContainerRef.injector)

        return new Promise((resolve) => {
            const index = this.viewRootContainerRef.length

            const componentRef: ComponentRef<NxtModalComponent> = this.viewRootContainerRef.createComponent(modal, index, injector)
            const viewRef = this.viewRootContainerRef.get(index)

            componentRef.instance.setViewRef(viewRef)

            resolve(viewRef)
        })
    }

    public close (viewContainerRef: ViewContainerRef, viewRef) {
        const index =  viewContainerRef.indexOf(viewRef)

        if (index > -1) {
            viewContainerRef.remove(index)
        }
    }
}
