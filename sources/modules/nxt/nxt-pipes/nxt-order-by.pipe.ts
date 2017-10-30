import { Pipe } from '@angular/core'

@Pipe({
    name: 'orderBy',
})

export class NxtOrderByPipe {
    public transform (input: any[], argument: string, desc: boolean = false) {
        return input.sort((a: any, b: any): number => {
            if (a[argument] === null || a[argument] === undefined) { a[argument] = 0 }
            if (b[argument] === null || b[argument] === undefined) { b[argument] = 0 }

            if ((isNaN(parseFloat(a[argument])) || !isFinite(a[argument])) || (isNaN(parseFloat(b[argument])) || !isFinite(b[argument]))) {
                a[argument] = a[argument].toString()
                b[argument] = b[argument].toString()

                if (a[argument].toLowerCase() < b[argument].toLowerCase()) { return desc ? 1 : -1 }
                if (a[argument].toLowerCase() > b[argument].toLowerCase()) { return desc ? -1 : 1 }
            } else {
                if (parseFloat(a[argument]) < parseFloat(b[argument])) { return desc ? 1 : -1 }
                if (parseFloat(a[argument]) > parseFloat(b[argument])) { return desc ? -1 : 1 }
            }

            return 0
        })
    }
}
