export class EventsService {
    private events: any[]

    public constructor () {
        this.events = []
    }

    public on (ref, event: string, callback: Function) {
        if (this.events[event] === undefined) {
            this.events[event] = []
        }

        this.events[event].push({ callback: callback, ref: ref })
    }

    public dispatch (event: string, ...args) {
        if (this.events[event] !== undefined) {
            this.events[event].forEach(row => row.callback(...args))
        }
    }

    public unsubscribe (event: string, ref) {
        this.events[event] = this.events[event].filter(row => row.ref !== ref)
    }
}
