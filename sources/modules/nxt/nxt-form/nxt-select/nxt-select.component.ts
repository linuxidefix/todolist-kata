import { Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core'
import { SafeHtml } from '@angular/platform-browser'
import { Observable } from 'rxjs/Rx'

import { inputs, NxtFormComponent, NxtFormService, NxtSelectOptionComponent, outputs } from '../'

@Component({
    encapsulation: ViewEncapsulation.None,
    host: {
        '(document:click)': 'onClick($event)',
    },
    inputs,
    outputs,
    selector: 'nxt-select',
    styles: [
        require('../_nxt-form.component.scss'),
        require('./_nxt-select.component.scss'),
    ],
    template: `
        <div class="nxt-select-container" [ngClass]="{ 'error': !valid && (touched || formSent), 'disabled': disabled }">
            <div class="label-container">
                <div class="label" *ngIf="label !== ''">{{label}} <span class="nxt-input-required" *ngIf="required">*</span> :</div>
                <div class="nxt-select-autocomplete-container" *ngIf="autocomplete" [ngClass]="{ 'multiple': multiple }">
                    <div class="nxt-select-tag" *ngFor="let t of selectedTags">
                        <span class="nxt-select-tag-text">{{ t.textContent }}</span>
                        <button (click)="removeTag(t)" type="button" class="nxt-select-tag-delete"><i class="fa fa-times"></i></button>
                    </div>
                    <input type="text" *ngIf="(selectedTags.length === 0) || multiple" (keyup)="keyup($event)" [(ngModel)]="currentTextOption" [placeholder]="placeholder" class="nxt-select-input-autocomplete" autocomplete="off" [disabled]="disabled" />
                </div>
                <div *ngIf="autocomplete && loading" class="nxt-select-loader"></div>
            </div>

            <div class="nxt-select-dropdown" *ngIf="!autocomplete" (click)="showOptions = disabled ? false : !showOptions">
                <span class="nxt-select-current-option" [innerHtml]="currentOption"></span>
                <span class="fa fa-caret-down"></span>
            </div>

            <div [hidden]="!showOptions" class="nxt-select-options">
                <ng-content></ng-content>
                <nxt-select-option *ngFor="let option of autocompleteResults" [value]="option.value">
                    <span class="ntx-select-option-label">{{ option.label }}</span>
                    <span class="ntx-select-option-sub-label" *ngIf="option.subLabel !== ''">{{ option.subLabel }}</span>
                </nxt-select-option>
            </div>

            <div class="error-msg" *ngIf="!valid && (touched || formSent)">{{errorMsg}}</div>
        </div>
    `,
})

export class NxtSelectComponent extends NxtFormComponent {
    @Input() public label: string = ''

    @Input() public autocomplete: boolean
    @Input() public placeholder: string = ''
    @Input() public multiple: boolean = false
    @Input() public currentTextOption: string = ''
    @Output() public currentTextOptionChange: EventEmitter<string> =  new EventEmitter<string>()
    @Output() public autocompleteCallback: any = new EventEmitter<Observable<{}>>()

    public autocompleteResults: NxtSelectAutocompleteResults[]
    public showOptions: boolean = false
    public loading: boolean = false
    public currentOption: SafeHtml = ''
    public selectedTags: NxtSelectOptionComponent[] = []

    private optionsList: NxtSelectOptionComponent[] = []

    private initialValue: string = ''
    private initialTextOption: string = ''
    private initialOption: SafeHtml = ''
    private timeout: any
    private elementRef: ElementRef

    constructor (
        elementRef: ElementRef,
        nxtFormService: NxtFormService,
    ) {
        super(nxtFormService)

        this.elementRef = elementRef
    }

    public ngOnInit () {
        if (this.initialValue === '') {
            this.initialValue = this._value
        }

        this.init()
    }

    set value (value: any) {
        if (this.optionsList === undefined) {
            this.optionsList = []
        }

        if (this.optionsList.length === 0) {
            this.initialValue = value
        }

        if (this._value !== value) {
            const options = this.optionsList.filter((o) => o.value === value)

            if (options.length > 0 && this.checkIfOptionInDom(options[0])) {
                this.initChange(options[0])
            } else {
                this.onChange(value)
            }
        }
    }

    get value () {
        return this._value
    }

    public initChange (option: NxtSelectOptionComponent) {
        this.showOptions = false

        this.currentTextOption = ''
        this.currentOption = ''
        this.currentOption = option.getInnerHTML()
        this.autocompleteResults = []

        if (this.multiple) {
            if (!Array.isArray(this._value)) {
                this._value = []
            }

            this.selectedTags = [ ...this.selectedTags, option ]

            this.onChange([ ...this.selectedTags.map((t) => t.value) ])
        } else {
            this.selectedTags = [ option ]
            this.onChange(option.value)
        }
    }

    public keyup (event) {
        const search = event.path !== undefined ? event.path[0].value : event.target.value
        this.showOptions = true
        this.loading = true

        this.currentTextOptionChange.emit(search)

        this.nxtFormService.dispatch('cancelSearch')
        clearTimeout(this.timeout)

        let cancelled = false
        this.nxtFormService.on(event, 'cancelSearch', () => {
            cancelled = true

            this.nxtFormService.unsubscribe('cancelSearch', event)
        })

        const callback = (res: NxtSelectAutocompleteResults[]) => {
            if (!cancelled) {
                this.autocompleteResults = res
                this.loading = false
            }
        }

        this.timeout = setTimeout(() => {
            this.autocompleteCallback.emit({ callback, search })
        }, 500)
    }

    public addOption (option: NxtSelectOptionComponent) {
        this.optionsList.push(option)

        if (!this.autocomplete && ((this.currentOption === '' && (this._value === '' || this._value === undefined)) || this._value === option.value || this.initialValue === option.value)) {
            this.initialTextOption = option.textContent
            this.initialOption = option.getInnerHTML()
            this.initChange(option)
            this.touched = false
        }
    }

    public removeTag (tag: any) {
        this.selectedTags = [
            ...this.selectedTags.filter((t) => t !== tag),
        ]

        this.onChange(this.multiple ? this.selectedTags.map((o) => o.value) : this.selectedTags.length > 0 ? this.selectedTags[0].value : '')
    }

    public onClick (event) {
        const target = event.path !== undefined ? event.path[0] : event.target
        const selectDropdown = this.elementRef.nativeElement.querySelector('.nxt-select-dropdown') || this.elementRef.nativeElement.querySelector('.nxt-select-input-autocomplete')
        const selectOptions = this.elementRef.nativeElement.querySelector('.nxt-select-options')

        if (selectDropdown === null || (!selectDropdown.contains(target) && !selectOptions.contains(target))) {
            this.showOptions = false
        }
    }

    public reset () {
        this.showOptions = false

        this.currentTextOption = this.initialTextOption
        this.currentOption = this.initialOption
        this.onChange(this.initialValue, false)
    }

    private checkIfOptionInDom (option: NxtSelectOptionComponent) {
        const selectOptions = this.elementRef.nativeElement.querySelector('.nxt-select-options')
        const optionElement = option.elementRef.nativeElement

        if (selectOptions.contains(optionElement)) {
            return true
        } else {
            this.optionsList = this.optionsList.filter((o) => o !== option)

            return false
        }
    }
}

export class NxtSelectAutocompleteResults {
    public label: string
    public subLabel: string
    public value: any

    constructor (label: string, subLabel: string, value: any) {
        this.label = label
        this.subLabel = subLabel
        this.value = value
    }
}
