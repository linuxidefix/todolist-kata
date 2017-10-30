import { EventEmitter } from '@angular/core'

import { NxtFormService } from './'

export abstract class NxtFormComponent {
    public form: string
    public name: string
    public valueChange: EventEmitter<any> = new EventEmitter<any>()
    public valid: boolean
    public validChange: EventEmitter<any> = new EventEmitter<any>()
    public touched: boolean
    public touchedChange: EventEmitter<any> = new EventEmitter<any>()
    public _required: boolean
    public errorMsg: string
    public onUpdate: EventEmitter<any> = new EventEmitter<any>()

    public nxtFormService: NxtFormService

    protected _formSent: boolean
    protected _value: any
    protected _customValid: boolean = true
    private _disabled: boolean

    constructor (nxtFormService: NxtFormService) {
        this.form = ''
        this.name = ''
        this.value = ''
        this._value = ''
        this.required = false
        this.disabled = false
        this.valid = true
        this.touched = false
        this.formSent = false
        this._formSent = false
        this.errorMsg = 'This field is not valid.'

        this.nxtFormService = nxtFormService
    }

    set formSent (formSent: boolean) {
        if (this._formSent !== formSent) {
            this._formSent = formSent
            this.updateState(this.touched)
        }
    }

    get formSent () {
        return this._formSent
    }

    set value (value: any) {
        if (this._value !== value) {
            this._value = value

            this.updateState(this.touched)
        }
    }

    get value () {
        return this._value
    }

    set customValid (customValid: boolean) {
        if (this._customValid !== customValid) {
            this._customValid = customValid
            this.updateState(this.touched)
        }
    }

    get customValid () {
        return this._customValid
    }

    set disabled (value: boolean) {
        this._disabled = value
    }

    get disabled () {
        return this._disabled
    }

    set required (value: boolean) {
        if (this._required !== value) {
            this._required = value
            this.updateState(this.touched)
        }
    }

    get required () {
        return this._required
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
        setTimeout(() => {
            this.updateState(false)
        })

        this.nxtFormService.on(this, 'reset', () => this.reset())
    }

    public ngOnDestroy () {
        this.nxtFormService.unsubscribe('reset', this)
        this.nxtFormService.dispatch('updateStateForm', this.name, this.value, true)
    }

    public isValid () {
        return !this.required || (this.value !== '' && this.value !== null)
    }

    public abstract reset ()

    private updateState (touched) {
        this.valid = this.isValid() && this.customValid
        this.validChange.emit(this.valid)
        this.touched = touched
        this.touchedChange.emit(this.touched)

        if (this.nxtFormService !== undefined) {
            this.nxtFormService.dispatch('updateStateForm', this.name, this.value, this.valid)
        }
    }
}

export const inputs = [ 'form', 'name', 'value', 'valid', 'customValid', 'touched', 'required', 'disabled', 'index', 'formSent', 'errorMsg' ]
export const outputs = [ 'onUpdate', 'valueChange', 'validChange', 'touchedChange' ]
