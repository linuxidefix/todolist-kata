module.exports = `import { Inject } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router'

import { AppActions } from '{{appPath}}'
import { {{componentClassName}} } from './{{selector}}.component'

export class {{resolverClassName}} implements CanActivate {
    private appStore

    constructor (
        @Inject('AppStore') appStore
    ) {
        this.appStore = appStore
    }

    public canActivate (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        this.appStore.dispatch(AppActions.setAppState({ loading: true }))

        return true
    }
}

export const {{routeObjectName}} = {
    canActivate: [ {{resolverClassName}} ],
    component: {{componentClassName}},
    path: '{{componentRoute}}',
}
`