import { Component, Inject } from '@angular/core'

import { AppActions } from './'

@Component({
    selector: 'app',
    styles: [ require('./_maintenance.component.scss') ],
    template: `
        <div class="container">
            <h3 class="text-center">{{ 'This web site is currently down for maintenance' | translate }}</h3>
            <p class="text-center">{{ 'We\\'ll be back soon !' | translate }}</p>
            <p class="text-center">
                <img src="/img/maintenance.png" class="maintenance-img" />
            </p>
        </div>
    `,
})

export class MaintenanceComponent {

    private appStore

    constructor (
        @Inject('AppStore') appStore,
    ) {
        this.appStore = appStore
    }

    public ngOnInit () {
        this.appStore.dispatch(AppActions.setLoading(false))
    }

}
