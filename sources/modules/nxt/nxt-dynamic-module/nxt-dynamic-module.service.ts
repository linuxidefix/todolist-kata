import { CommonModule } from '@angular/common'
import { Compiler, Injectable, NgModule, NgModuleRef, ReflectiveInjector, ValueProvider, ViewContainerRef } from '@angular/core'

@Injectable()
export class NxtDynamicModuleService {
    private compiler: Compiler
    private ngModuleRef: NgModuleRef<{}>

    constructor (compiler: Compiler) {
        this.compiler = compiler
        this.ngModuleRef = null
    }

    public createComponentFactory (component, providers: ValueProvider[], declarations: any[], viewContainerRef: ViewContainerRef, index: number) {
        this.compiler.clearCache()

        if (this.ngModuleRef !== null) {
            return new Promise((resolve) => this.createComponent(component, providers, viewContainerRef, index))
        } else {
            return this.compiler.compileModuleAsync(this.createDynamicModule(component, declarations))
                .then((value) => {
                    this.ngModuleRef = value.create(viewContainerRef.injector)

                    return this.createComponent(component, providers, viewContainerRef, index)
                })
        }
    }

    private createComponent (component, providers: ValueProvider[], viewContainerRef: ViewContainerRef, index: number) {
        const factory = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(component)

        const childInjector = ReflectiveInjector.resolve(providers)
        const injector = ReflectiveInjector.fromResolvedProviders(childInjector, viewContainerRef.injector)
        const componentRef = viewContainerRef.createComponent(factory, index, injector)

        return componentRef
    }

    private createDynamicModule (component, declarations: any[]) {
        @NgModule({
            declarations: [ component, ...declarations ],
            entryComponents: [ component ],
            imports: [ CommonModule ],
        })

        class DynamicModule {}

        return DynamicModule
    }
}
