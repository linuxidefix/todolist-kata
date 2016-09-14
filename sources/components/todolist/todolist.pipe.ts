import { Pipe, PipeTransform } from '@angular/core'

import { ITodoInput } from '../../helpers'

@Pipe({
    name: 'todolist',
})
export class TodolistPipe implements PipeTransform {
    public transform (input: ITodoInput[]): ITodoInput[] {
        return input
    }
}
