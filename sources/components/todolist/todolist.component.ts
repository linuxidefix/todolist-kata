import { Component, Inject, ViewEncapsulation } from '@angular/core'

import { AppActions } from '../../app'
import { NxtCheckboxComponent, NxtFormService, NxtInputComponent } from '../../modules/nxt-form'
import { TodoList } from './todolist.class'

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
    public todoList: TodoList[]
    public selectedFilter: string

    // A supprimer
        public todoTest: TodoList

    // Redux
    private appStore

    constructor (@Inject('AppStore') appStore) {
        this.todolistInput = ''
        this.todoList = []
        this.selectedFilter = 'all'

        // A supprimer
            this.todoTest = new TodoList()
            this.todoTest.completed = false
            this.todoTest.text = 'Ceci est une tâche de test :)'

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
}
