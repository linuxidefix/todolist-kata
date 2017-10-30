import { NavigationEnd, Router } from '@angular/router'

export abstract class NxtAnalyticsService {
    protected initialized: boolean = false

    constructor (router: Router) {
        router.events.subscribe((e) => {
            if (this.initialized && e instanceof NavigationEnd) {
                this.routeChanged(e.urlAfterRedirects)
            }
        })
    }

    public abstract init (key: string): void
    public abstract routeChanged (route: string): void
}
