import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'
import { BrowserModule } from '@angular/platform-browser'

import { NxtAlertComponent } from './nxt-alert'
import { NxtAnalyticsGoogleService } from './nxt-analytics'
import { NxtApiService } from './nxt-api'
import { NxtChartComponent } from './nxt-chart'
import { NxtCountdownComponent } from './nxt-countdown'
import { NxtDatepickerComponent } from './nxt-datepicker'
import { NxtDropdownComponent, NxtDropdownItemComponent } from './nxt-dropdown'
import { NxtDynamicModuleService } from './nxt-dynamic-module/nxt-dynamic-module.service'
import {
    NxtCheckboxComponent,
    NxtFileComponent,
    NxtFormDirective,
    NxtFormService,
    NxtInputComponent,
    NxtRadioComponent,
    NxtRadioItemComponent,
    NxtSelectComponent,
    NxtSelectOptionComponent,
    NxtSwitchComponent,
    NxtTextareaComponent,
} from './nxt-form'
import { NxtGamesComponent, NxtGamesOutletComponent, NxtSnakeComponent } from './nxt-games'
import { NxtModalComponent, NxtModalService } from './nxt-modal'
import { NxtOrderByPipe } from './nxt-pipes'
import { NxtSwipElemComponent, NxtSwiperComponent } from './nxt-swiper'
import { NxtTabComponent, NxtTabContainerComponent } from './nxt-tab'
import { NxtToastComponent, NxtToastContainerComponent, NxtToastService } from './nxt-toast'
import { NxtTooltipComponent, NxtTooltipDirective, NxtTooltipService } from './nxt-tooltip'
import { NxtTranslatePipe, NxtTranslateService } from './nxt-translate'
import { NxtWebsocketClientService } from './nxt-websocket-client/nxt-websocket-client.service'

export const components = [
    NxtAlertComponent,
    NxtChartComponent,
    NxtCheckboxComponent,
    NxtCountdownComponent,
    NxtDatepickerComponent,
    NxtDropdownComponent,
    NxtDropdownItemComponent,
    NxtFileComponent,
    NxtFormDirective,
    NxtGamesComponent,
    NxtGamesOutletComponent,
    NxtInputComponent,
    NxtModalComponent,
    NxtOrderByPipe,
    NxtRadioComponent,
    NxtRadioItemComponent,
    NxtSelectComponent,
    NxtSelectOptionComponent,
    NxtSnakeComponent,
    NxtSwipElemComponent,
    NxtSwiperComponent,
    NxtSwitchComponent,
    NxtTabComponent,
    NxtTabContainerComponent,
    NxtTextareaComponent,
    NxtToastComponent,
    NxtToastContainerComponent,
    NxtTooltipComponent,
    NxtTooltipDirective,
    NxtTranslatePipe,
]

@NgModule({
    declarations: components,
    entryComponents: [ NxtGamesComponent, NxtModalComponent, NxtSnakeComponent, NxtToastContainerComponent, NxtTooltipComponent ],
    exports: components,
    imports: [ CommonModule, BrowserModule, FormsModule, HttpModule ],
    providers: [
        NxtAnalyticsGoogleService,
        NxtApiService,
        NxtDynamicModuleService,
        NxtFormService,
        NxtModalService,
        NxtToastService,
        NxtTooltipService,
        NxtTranslateService,
        NxtWebsocketClientService,
    ],
})

export class NxtModule {}
