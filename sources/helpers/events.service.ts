export class EventsService {
    private events: any[]

    public constructor () {
        this.events = []
    }

    public on (ref: any, event: string | string[], callback: (...args) => void) {
        if (Array.isArray(event)) {
            event.forEach((ev) => {
                 this.addToListEvents(ev, callback, ref)
            })
        } else {
            this.addToListEvents(event, callback, ref)
        }
    }

    public dispatch (event: string, ...args) {
        if (this.events[event] !== undefined) {
            this.events[event].forEach((row) => row.callback(...args))
        }
    }

    public unsubscribe (event: string, ref: any) {
        this.events[event] = this.events[event].filter((row) => row.ref !== ref)
    }

    private addToListEvents (event: string, callback: (...args) => void, ref: any) {
        if (this.events[event] === undefined) {
            this.events[event] = []
        }

        this.events[event].push({ callback, ref })
    }
}
