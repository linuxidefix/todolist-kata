import 'core-js'
import 'zone.js/dist/zone'

/**
 * Production mode
 */
import { enableProdMode } from '@angular/core'
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'maintenance') {
    enableProdMode()
}

import { Bootstrap } from './app'

Bootstrap()

if (module['hot']) {
    module['hot'].accept()
}
