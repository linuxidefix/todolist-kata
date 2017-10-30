import { Pipe, PipeTransform } from '@angular/core'

import { TodoList } from './todolist.class'

@Pipe({
    name: 'todolist',
})
export class TodolistPipe implements PipeTransform {

    public transform (input: TodoList[], selectedFilter: string = 'all'): TodoList[] {
        return input.filter(t => {
            if (selectedFilter === 'all') {
                return true
            } else if (selectedFilter === 'actives') {
                return t.completed === false
            } else {
                return t.completed === true
            }
        })
    }

}
