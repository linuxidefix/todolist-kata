export class NxtForm {
    public fieldsState: NxtFieldState[] = []

    constructor (entity: any) {
        Object.getOwnPropertyNames(entity).forEach((prop: string) => {
            const field: NxtFieldState = this.getNxtField(entity[prop], prop, prop)

            if (field !== null) {
                this.fieldsState.push(field)
            }
        })
    }

    public updateForm (fieldName: string, value: any, valid: boolean) {
        this.fieldsState = this.updateFieldsState(this.fieldsState, fieldName, fieldName, value, valid)
    }

    public checkForErrors (fieldsState: NxtFieldState[] = [ ...this.fieldsState ], errors: any[] = [], test: boolean = false): any[] {
        fieldsState.forEach((field: NxtFieldState) => {
            if (!field.valid) {
                errors = [ ...errors, field ]
            }

            if (field.nxtFieldState.length) {
                errors = this.checkForErrors(field.nxtFieldState, errors, field.nxtFieldState[0].valid)
            }
        })

        return errors
    }

    private updateFieldsState (fieldsState: NxtFieldState[], attribute: string, fieldName: string, value: any, valid: boolean): NxtFieldState[] {
        const objectPart: string[] = attribute.split('.')

        return fieldsState.map((field: NxtFieldState) => {
            if (field.attribute === objectPart[0]) {
                if (objectPart.slice(1).length) {
                    field.nxtFieldState = this.updateFieldsState(field.nxtFieldState, objectPart.slice(1).join('.'), fieldName, value, valid)
                } else {
                    field = this.getNxtField(value, objectPart[0], fieldName, valid)
                }
            }

            return field
        })
    }

    private getNxtField (value, prop, fieldName, valid: boolean = true): NxtFieldState {
        let nxtField: NxtFieldState

        if (Array.isArray(value)) {
            nxtField = new NxtFieldState(prop, fieldName, value, valid, value.map((val, index) => this.getNxtField(val, index, fieldName)))
        } else if (value && typeof value === 'object') {
            nxtField = new NxtFieldState(prop, fieldName, value, valid, Object.getOwnPropertyNames(value).map((property: string) => this.getNxtField(value[property], property, fieldName)))
        } else {
            nxtField =  new NxtFieldState(prop, fieldName, value, valid)
        }

        return nxtField
    }
}

export class NxtFieldState {
    public attribute: string
    public fieldName: string
    public value: any
    public valid: boolean
    public nxtFieldState: NxtFieldState[]

    constructor (attribute: string = '', fieldName: string, value: any = null, valid: boolean = true, nxtFieldState: NxtFieldState[] = []) {
        this.attribute = attribute
        this.fieldName = fieldName
        this.value = value
        this.valid = valid
        this.nxtFieldState = nxtFieldState
    }
}
