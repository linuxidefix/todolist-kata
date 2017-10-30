module.exports = `import { Component, Inject } from '@angular/core'

import { AppActions } from '{{appPath}}'

@Component({
    selector: '{{selector}}',
    template: '',
})

export class {{componentClassName}} {

    private appStore

    constructor (
        @Inject('AppStore') appStore
    ) {
        this.appStore = appStore
    }

    public ngOnInit () {
        this.appStore.dispatch(AppActions.setAppState({ loading: false }))
    }

}
`