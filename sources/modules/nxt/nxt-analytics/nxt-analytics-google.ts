import { Injectable } from '@angular/core'
import { Router } from '@angular/router'

import { NxtAnalyticsService } from './nxt-analytics.service'

declare var ga: any

@Injectable()
export class NxtAnalyticsGoogleService extends NxtAnalyticsService {
    constructor (router: Router) {
        super(router)
    }

    public init (key: string) {
        if (key === '') {
            throw new Error('[NxtAnalyticsService] The key is mandatory for Google Analytics')
        }

        ((i, s, o, g, r, a?, m?) => {
            i['GoogleAnalyticsObject'] = r
            i[r] = i[r] || function () { (i[r].q = i[r].q || []).push(arguments) }
            const d = new Date()
            i[r].l = 1 * d.getTime()
            a = s.createElement(o)
            m = s.getElementsByTagName(o)[0]
            a.async = 1
            a.src = g
            m.parentNode.insertBefore(a, m)
        })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga')

        ga('create', key, 'auto')
        ga('send', 'pageview')

        this.initialized = true
    }

    public routeChanged (route: string) {
        ga('send', 'pageview', route)
    }
}
