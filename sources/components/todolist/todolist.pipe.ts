import { Pipe, PipeTransform } from '@angular/core'

import { ITodoInput } from '../../helpers'

@Pipe({
    name: 'todolist',
})
export class TodolistPipe implements PipeTransform {
    public transform (input: ITodoInput[], selectedFilter: string = 'all'): ITodoInput[] {
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
