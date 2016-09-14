import { ElementRef, EventEmitter, Input, Output, ViewEncapsulation, forwardRef } from '@angular/core'
import { Observable } from 'rxjs/Rx'

import { NxtFormComponent, NxtFormService, NxtSelectOptionComponent, inputs, outputs } from '../'
import { ComponentComplement } from '../../../base.component'

@ComponentComplement({
    directives: [ forwardRef(() => NxtSelectOptionComponent) ],
    encapsulation: ViewEncapsulation.None,
    host: {
        '(document:click)': 'onClick($event)',
    },
    inputs: inputs,
    outputs: outputs,
    selector: 'nxt-select',
    styles: [
        require('./_nxt-select.component.scss'),
    ],
    template: `
        <div class="nxt-select-container" [ngClass]="{'error': !valid && (touched || formSent), 'disabled': disabled}">
            <label>
                <div class="label" *ngIf="label != ''">{{label}} <span class="nxt-input-required" *ngIf="required">*</span> :</div>
                <input [placeholder]="placeholder" type="text" *ngIf="autocomplete" (keyup)="keyup($event)" [(ngModel)]="currentOption" class="nxt-select-input-autocomplete" autocomplete="off" [disabled]="disabled" />
            </label>

            <div class="nxt-select-dropdown" *ngIf="!autocomplete" (click)="showOptions = disabled ? false : !showOptions">
                <span class="nxt-select-current-option">{{currentOption}}</span>
                <span class="fa fa-caret-down"></span>
            </div>

            <div [hidden]="!showOptions" class="nxt-select-options">
                <ng-content></ng-content>
                <nxt-select-option *ngFor="let option of autocompleteResults" [value]="option.value" [textContent]="option.label"></nxt-select-option>
            </div>

            <div class="error-msg" *ngIf="!valid && (touched || formSent)">{{errorMsg}}</div>
        </div>
    `,
})

export class NxtSelectComponent extends NxtFormComponent {
    @Input() public label: string

    @Input() public autocomplete: boolean
    @Input() public placeholder: any
    @Input() public autocompleteResults: INxtSelectAutocompleteResults[]
    @Output() public autocompleteCallback: any = new EventEmitter<Observable<{}>>()

    public showOptions: boolean
    public currentOption: string

    private timeout: any
    private elementRef: ElementRef

    constructor (
        elementRef: ElementRef,
        nxtFormService: NxtFormService
    ) {
        super(nxtFormService)

        this.label = ''

        this.showOptions = false
        this.currentOption = ''
        this.elementRef = elementRef
        this.index = -1
    }

    public initChange (option) {
        this.showOptions = false

        this.currentOption = ''
        this.currentOption = option.textContent

        this.onChange(option.value)
    }

    public keyup (event) {
        let value = event.path !== undefined ? event.path[0].value : event.target.value
        this.showOptions = true

        clearTimeout(this.timeout)

        this.timeout = setTimeout(() => {
            this.autocompleteCallback.emit(value)
        }, 500)
    }

    public addOption (option: NxtSelectOptionComponent) {
        if (!this.autocomplete && ((this.currentOption === '' && (this.value === '' || this.value === undefined)) || this.value === option.value)) {
            this.initChange(option)
            this.touched = false
        }
    }

    public onClick (event) {
        let target = event.path !== undefined ? event.path[0] : event.target
        let selectDropdown = this.elementRef.nativeElement.querySelector('.nxt-select-dropdown') || this.elementRef.nativeElement.querySelector('.nxt-select-input-autocomplete')
        let selectOptions = this.elementRef.nativeElement.querySelector('.nxt-select-options')

        if (!selectDropdown.contains(target) && !selectOptions.contains(target)) {
            this.showOptions = false
        }
    }

    public reset () {
        this.showOptions = false

        this.currentOption = ''
        this.onChange('', false)
    }
}

export interface INxtSelectAutocompleteResults {
    value: any
    label: string
}
