import { Pipe, PipeTransform } from '@angular/core'

import { TodoList } from './todolist.class'

@Pipe({
    name: 'todolist',
})
export class TodolistPipe implements PipeTransform {
    public transform (input: TodoList[]): TodoList[] {
        return input
    }
}
