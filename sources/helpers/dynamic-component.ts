import { Component } from '@angular/core'

export class DynamicComponent {
    public static create<T extends IBase> (componentAttributes: any, SuperClass: IConstructor<T>) {
        class DynamicComponent extends (<IConstructor<IBase>> SuperClass) {}

        return Component(componentAttributes)(DynamicComponent)
    }
}

interface IConstructor<T> {
    new (...args): T
}

interface IBase {}
