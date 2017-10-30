import { Component, ElementRef, Input, ViewEncapsulation } from '@angular/core'

import { inputs, NxtFormComponent, NxtFormService, outputs } from '../'
import { NxtTranslatePipe } from '../../nxt-translate'

@Component({
    encapsulation: ViewEncapsulation.None,
    inputs,
    outputs,
    providers: [ NxtTranslatePipe ],
    selector: 'nxt-file',
    styles: [
        require('../_nxt-form.component.scss'),
        require('./_nxt-file.component.scss'),
    ],
    template: `
        <div class="nxt-file-container" [ngClass]="{'error': !valid && (touched || formSent), 'disabled': disabled}">
            <div class="label" *ngIf="label != ''">{{label}} <span class="nxt-input-required" *ngIf="required">*</span> :</div>

            <ul>
                <li *ngFor="let file of files; let i = index">
                    {{file.name}} <button type="button" class="danger fa fa-times" (click)="deleteFile(i)"></button>
                </li>
            </ul>

            <label [ngClass]="{'hide': files.length >= nbFileLimit, 'dragover': dragover}" class="nxt-file-drop-zone">
                <div class="nxt-file-text-rules">
                    <p class="text-center">{{'Drop your file here' | translate}}</p>
                    <p class="text-center">{{'Or' | translate}}</p>
                    <p class="text-center">{{'Click here to browse your file' | translate}}</p>
                </div>

                <div class="nxt-file-text-drop">
                    <p class="text-center">&nbsp;</p>
                    <p class="text-center">{{'Drop here' | translate}}</p>
                    <p class="text-center">&nbsp;</p>
                </div>

                <input type="file" name="{{name}}" (change)="initChange($event)" [required]="required" />
            </label>

            <div class="error-msg" *ngIf="!valid && (touched || formSent)">{{errorMsg}}</div>
        </div>
    `,
})

export class NxtFileComponent extends NxtFormComponent {
    @Input() public label: string
    @Input() public nbFileLimit: number
    @Input() public accepted: string[]
    public files: File[]
    public dragover: boolean

    private elementRef: ElementRef
    private nxtTranslatePipe: NxtTranslatePipe

    constructor (
        elementRef: ElementRef,
        nxtTranslatePipe: NxtTranslatePipe,
        nxtFormService: NxtFormService,
    ) {
        super(nxtFormService)

        this.label = ''
        this.elementRef = elementRef
        this.nbFileLimit = 1
        this.files = []
        this.dragover = false
        this.accepted = []

        this.nxtTranslatePipe = nxtTranslatePipe
    }

    public ngOnInit () {
        this.init()

        const dropzone = this.elementRef.nativeElement.querySelector('.nxt-file-drop-zone')
        dropzone.addEventListener('dragover', dragover)
        dropzone.addEventListener('dragenter', (e) => {
            if (!this.disabled) {
                e.preventDefault()
                this.dragover = true
            }
        })
        dropzone.addEventListener('dragleave',  (e) => this.dragover = false)
        dropzone.addEventListener('drop', (e) => {
            if (!this.disabled) {
                e.preventDefault()

                this.dragover = false

                this.handleFiles(e.dataTransfer.files)

                return false
            }
        })

        ///////////////

        function dragover (e) {
            e.preventDefault()
        }
    }

    set value (value: FileList) {
        if (value && value !== this._value) {
            this.handleFiles(value)
        }
    }

    get value () {
        return this._value
    }

    public initChange (event) {
        if (!this.disabled) {
            const input = this.elementRef.nativeElement.querySelector('input')

            this.handleFiles(input.files)

            input.value = ''
        }
    }

    public deleteFile (index) {
        this.files.splice(index, 1)

        this.onChange(this.files.length > 0 ? this.files : '')
    }

    public reset () {
        this.files = []

        this.onChange('', false)
    }

    private handleFiles (files: FileList) {
        let badExtention: boolean = false
        let regex: RegExp

        regex = (this.accepted.length > 0) ? new RegExp(`\.(${this.accepted.join('|')})$`) : new RegExp(`\.(.+)$`)

        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                if (regex.test(files[i].name)) {
                    this.files.push(files[i])
                } else {
                    badExtention = true
                }
            }

            if (badExtention) {
                alert(this.nxtTranslatePipe.transform('Accepted file formats are: {$0}', [this.accepted.join(', ')]))
            }

            if (this.files.length > 0) {
                this.onChange(this.files)
            } else {
                this.onChange('')
            }
        }
    }
}
