import {Component, Inject, ViewEncapsulation} from '@angular/core'

import {AppActions} from '../../app'
import {TodoList} from './todolist.class'

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


    constructor(@Inject('AppStore') private appStore) {
        this.todolistInput = ''
        this.todoList = []
        this.selectedFilter = 'all'

        // A supprimer
        let todoTest: TodoList = new TodoList()
        todoTest.completed = false
        todoTest.text = 'Ceci est une tâche de test :)'
        this.todoList.push(todoTest)
    }

    /************
     * ICI VOS METHODES
     ************/

    public ngOnInit() {
        this.appStore.dispatch(AppActions.setLoading(false))
    }

    public tasksLeft() {
        return this.todoList.filter(t => !t.completed).length
    }

    public onSubmit() {
        const newTodoList: TodoList = new TodoList()
        newTodoList.text = this.todolistInput
        newTodoList.completed = false
        this.todoList.push(newTodoList)
        this.todolistInput = ''
    }

    public onTaskDelete(event, task: TodoList){
        this.todoList = this.todoList.filter((item) => item !== task)
    }

    public onFilterSelect(selectedFilter: string) {
        this.selectedFilter = selectedFilter
    }
}
