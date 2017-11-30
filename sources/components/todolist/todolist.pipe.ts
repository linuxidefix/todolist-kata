import { Pipe, PipeTransform } from '@angular/core'

import { TodoList } from './todolist.class'

@Pipe({
    name: 'todolist',
})
export class TodolistPipe implements PipeTransform {
    public transform (input: TodoList[], selectedFilter: string): TodoList[] {
        if (selectedFilter === 'all') {
            return input
        }

        if (selectedFilter === 'completed') {
            return  input.filter((task) => task.completed)
        }

        if (selectedFilter === 'actives') {
            return  input.filter((task) => !task.completed)
        }
    }
}
