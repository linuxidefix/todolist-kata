import { Inject, Pipe, PipeTransform } from '@angular/core'

import { NxtTranslateService } from './nxt-translate.service'

@Pipe({
    name: 'translate',
    pure: false,
})
export class NxtTranslatePipe implements PipeTransform {
    private translate: any
    private output: string

    constructor (@Inject(NxtTranslateService) translateService: NxtTranslateService) {
        this.translate = translateService.getTranslation()
        this.output = ''

        translateService.getTranslationObservable().subscribe((translate) => this.translate = translate)
    }

    public transform (input, varString: any[] = []): string {
        this.output = input

        if (this.translate[input] !== undefined) {
            this.output = this.translate[input]

            if (varString.length > 0) {
                varString.forEach((str, key) => {
                    this.output = this.output.replace(`{$${key}}`, str)
                })
            }
        }

        return this.output
    }
}
