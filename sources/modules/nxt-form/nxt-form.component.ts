import { EventEmitter } from '@angular/core'

import { BaseComponent, ComponentComplement } from '../../base.component'
import { NxtFormService } from './'

@ComponentComplement({
    styles: [
        require('./_nxt-form.component.scss'),
    ],
})

export abstract class NxtFormComponent extends BaseComponent {
    public form: string
    public name: string
    public valueChange: EventEmitter<any> = new EventEmitter<any>()
    public valid: boolean
    public validChange: EventEmitter<any> = new EventEmitter<any>()
    public touched: boolean
    public touchedChange: EventEmitter<any> = new EventEmitter<any>()
    public required: boolean
    public index: number
    public formSent: boolean
    public errorMsg: string
    public onUpdate: EventEmitter<any> = new EventEmitter<any>()

    private _value: any
    private _disabled: boolean
    private nxtFormService: NxtFormService

    constructor (nxtFormService: NxtFormService) {
        super()

        this.form = ''
        this.name = ''
        this.value = ''
        this.required = false
        this.disabled = false
        this.index = -1
        this.valid = true
        this.touched = false
        this.formSent = false
        this.errorMsg = 'This field is not valid.'

        this.nxtFormService = nxtFormService
    }

    set value (value: any) {
        if (this._value !== value) {
            this._value = value
        }
    }

    get value () {
        return this._value
    }

    set disabled (value: any) {
        this._disabled = value
    }

    get disabled () {
        return this._disabled
    }

    public onChange (value, touched: boolean = true) {
        this._value = value
        this.valueChange.emit(value)

        this.updateState(touched)

        this.onUpdate.emit(this.value)
    }

    public ngOnInit () {
        this.init()
    }

    public init () {
        this.updateState(false)

        this.nxtFormService.on(this, 'reset', () => this.reset())
    }

    public ngOnDestroy() {
        this.nxtFormService.unsubscribe('reset', this)
    }

    public isValid () {
        return !this.required || this.value !== ''
    }

    public abstract reset ()

    private updateState (touched) {
        this.valid = this.isValid()
        this.validChange.emit(this.valid)
        this.touched = touched
        this.touchedChange.emit(this.touched)
    }
}

export const inputs = [ 'form', 'name', 'value', 'valid', 'touched', 'required', 'disabled', 'index', 'formSent', 'errorMsg' ]
export const outputs = [ 'onUpdate', 'valueChange', 'validChange', 'touchedChange' ]
