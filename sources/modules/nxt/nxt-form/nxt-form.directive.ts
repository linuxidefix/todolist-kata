import { Directive, EventEmitter, Input, Output } from '@angular/core'

import { NxtForm } from './nxt-form.model'
import { NxtFormService } from './nxt-form.service'

@Directive({
    selector: '[nxtForm]',
})
export class NxtFormDirective {
    @Input() public nxtForm: NxtForm
    @Output() public nxtFormChange: EventEmitter<NxtForm> = new EventEmitter<NxtForm>()

    private nxtFormService: NxtFormService

    constructor (nxtFormService: NxtFormService) {
        this.nxtFormService = nxtFormService
    }

    public ngOnInit () {
        if (!(this.nxtForm instanceof NxtForm)) {
            throw new Error('[NXTFORM: instance error]: You must give an instance of NxtForm to the [nxtForm] attribute.')
        }

        this.nxtFormService.on(this, 'updateStateForm', (fieldName: string, value: any, valid: boolean) => {
            this.nxtForm.updateForm(fieldName, value, valid)

            this.nxtFormChange.emit(this.nxtForm)
        })
    }

    public ngOnDestroy () {
        this.nxtFormService.unsubscribe('updateStateForm', this)
    }
}
