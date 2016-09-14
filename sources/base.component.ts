import 'reflect-metadata'

import { Component, ComponentMetadata } from '@angular/core'

import { NxtTranslatePipe } from './modules/nxt-translate'

@Component({
    pipes: [ NxtTranslatePipe ],
    styles: [`@import url('/dist/screen.css')`],
})

export class BaseComponent {}

export function ComponentComplement (annotation: any) {
    return function (target: Function) {
        let parentTarget = Object.getPrototypeOf(target.prototype).constructor
        let parentAnnotations = Reflect.getMetadata('annotations', parentTarget)

        let parentAnnotation = parentAnnotations[0]
        Object.keys(parentAnnotation).forEach(key => {
            if (parentAnnotation[key] !== undefined && annotation[key] === undefined) {
                annotation[key] = parentAnnotation[key]
            } else if (parentAnnotation[key] !== undefined && (key === 'styles' || key === '_inputs')) {
                annotation[key] = [ ...annotation[key], ...parentAnnotation[key] ]
            }
        })

        let metadata = new ComponentMetadata(annotation)

        Reflect.defineMetadata('annotations', [ metadata ], target)
    }
}
