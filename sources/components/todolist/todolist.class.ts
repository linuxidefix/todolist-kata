export class TodoList {
    public completed: boolean
    public text: string

    constructor(text?: string, completed?: boolean) {
        this.text = text
        this.completed = completed
    }

}
