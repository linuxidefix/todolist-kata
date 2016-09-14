import { Component, Inject, ViewEncapsulation } from '@angular/core'

import { AppActions } from '../../app'
import { ITodoInput } from '../../helpers'
import { NxtCheckboxComponent, NxtFormService, NxtInputComponent } from '../../modules/nxt-form'

@Component({
    directives: [ NxtCheckboxComponent, NxtInputComponent ],
    encapsulation: ViewEncapsulation.None,
    providers: [ NxtFormService ],
    selector: 'todolist',
    styles: [
        require('./_todolist.component.scss'),
    ],
    template: require('./_todolist.component.html'),
})

export class TodolistComponent {
    public todolistInput: string
    public todoList: ITodoInput[]
    public selectedFilter: string

    // Redux
    private appStore

    constructor (@Inject('AppStore') appStore) {
        this.todolistInput = ''
        this.todoList = []
        this.selectedFilter = 'all'

        this.appStore = appStore
    }

    /************
     * ICI VOS METHODES
     ************/

    public ngOnInit () {
        this.appStore.dispatch(AppActions.setLoading(false))
    }

    public tasksLeft () {
        return this.todoList.filter(t => !t.completed).length
    }

    public filter (filter: string) {
        this.selectedFilter = filter
    }

    public editContent (index) {
        this.todoList[index].editMode = true
    }
}
