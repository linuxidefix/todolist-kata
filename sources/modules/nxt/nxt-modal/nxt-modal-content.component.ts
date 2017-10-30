import { ViewContainerRef, ViewRef } from '@angular/core'

import { EventsService } from '../../../helpers'

export class NxtModalContentComponent {

    constructor (
        public context: any,
        protected eventsService: EventsService,
        private viewRefModal: ViewRef,
        private viewContainerRef: ViewContainerRef,
    ) {}

    public ngOnInit () {
        this.eventsService.on(this, 'nxtModalUpdateContext', (viewRefModal, c: string) => {
            if (this.viewRefModal === viewRefModal) {
                this.context = c
            }
        })
    }

    public ngOnDestroy () {
        this.eventsService.unsubscribe('nxtModalUpdateContext', this)
    }
}
