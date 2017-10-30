import { Inject } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router'
import { Observable } from 'rxjs'

import { AppActions } from '../../app'
import { TodolistComponent } from './todolist.component'

export class TodolistResolver implements CanActivate {

    constructor (
        @Inject(Router) private router: Router,
        @Inject('AppStore') private appStore,
    ) {
        this.router = router
        this.appStore = appStore
    }

    public canActivate (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        this.appStore.dispatch(AppActions.setLoading(true))

        return true
    }

}

export const todolistRoute = {
    canActivate: [ TodolistResolver ],
    component: TodolistComponent,
    path: 'todolist',
}

/// ROUTE EXPORTATION START
/// ROUTE EXPORTATION END

/// RESOLVERS IMPORTATION START
/// RESOLVERS IMPORTATION END

/// PROVIDERS EXPORTATION START
export const TODOLIST_ROUTE_PROVIDERS = [
    TodolistResolver,
]
/// PROVIDERS EXPORTATION END
