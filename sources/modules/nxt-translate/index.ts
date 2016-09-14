import { PLATFORM_PIPES, provide } from '@angular/core'

import { NxtTranslatePipe } from './nxt-translate.pipe'
import { NxtTranslateService } from './nxt-translate.service'

export { NxtTranslatePipe } from './nxt-translate.pipe'
export { NxtTranslateService } from './nxt-translate.service'

export const NXT_TRANSLATE_PROVIDER: any = [
    provide(PLATFORM_PIPES, {
        multi: true,
        useValue: [ NxtTranslatePipe ],
    }),
    NxtTranslateService,
]
