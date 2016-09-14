import { provideRouter } from '@angular/router'

import { TodolistComponent } from '../components/todolist/todolist.component'

const routes = [
    {
        component: TodolistComponent,
        path: '',
        useAsDefault: true,
    },
]

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes),
]
