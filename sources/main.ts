import '../node_modules/core-js/client/shim.min.js'
import '../node_modules/reflect-metadata/Reflect.js'
import '../node_modules/zone.js/dist/zone.js'

/**
 * Production mode
 */
import { enableProdMode } from '@angular/core'
if (process.env.NODE_ENV === 'production') {
    enableProdMode()
}

import { Bootstrap } from './app'

Bootstrap()
