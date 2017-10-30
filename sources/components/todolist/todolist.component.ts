import { Component, Inject, ViewEncapsulation } from '@angular/core'

import { AppActions } from '../../app'
import { TodoList } from './todolist.class'

@Component({
    encapsulation: ViewEncapsulation.None,
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

    constructor (
        @Inject('AppStore') private appStore
    ) {
        this.todolistInput = ''
        this.todoList = []
        this.selectedFilter = 'all'

        // A supprimer
            this.todoTest = new TodoList()
            this.todoTest.completed = false
            this.todoTest.text = 'Ceci est une tâche de test :)'
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
