module.exports = `import { ComponentFixture, TestBed } from '@angular/core/testing'

import { appStore } from '{{mockPath}}'
import { {{componentClassName}} } from '../{{selector}}.component'

describe('Component: {{componentClassName}}', () => {
    let component: {{componentClassName}}
    let fixture: ComponentFixture<{{componentClassName}}>

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                {{componentClassName}},
            ],
            imports: [],
            providers: [
                { provide: 'AppStore', useValue: appStore },
            ],
        })

        fixture = TestBed.createComponent({{componentClassName}})
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
`