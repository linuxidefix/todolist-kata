import { HTTP_PROVIDERS } from '@angular/http'

import { NxtApiService } from './nxt-api.service'

export { NxtApiService } from './nxt-api.service'

export const API_PROVIDERS = [
    NxtApiService,
    HTTP_PROVIDERS,
]
