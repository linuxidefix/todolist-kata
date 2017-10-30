import { ModuleWithProviders } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

/// ROUTE IMPORTATION START
import {
    TODOLIST_ROUTE_PROVIDERS,
    todolistRoute,
} from '../components/todolist/todolist.routes'

/// ROUTE IMPORTATION END

/// APP ROUTER EXPORTATION START
export const APP_ROUTER_PROVIDER: any[] = [
    TODOLIST_ROUTE_PROVIDERS,
]
/// APP ROUTER EXPORTATION END

/// ROUTES DEFINITION START
const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/todolist',
    },
    todolistRoute,
]
/// ROUTES DEFINITION END

export const routing: ModuleWithProviders = RouterModule.forRoot(routes)
