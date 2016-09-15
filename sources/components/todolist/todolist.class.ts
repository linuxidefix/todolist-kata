export class TodoList {
    public completed: boolean
    public editMode: boolean
    public text: string

    constructor (text: string, completed: boolean, editMode: boolean) {
        this.text = text
        this.completed = completed
        this.editMode = editMode
    }
}
