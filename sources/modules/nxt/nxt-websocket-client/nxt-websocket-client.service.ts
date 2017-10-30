import * as SocketIOClient from 'socket.io-client'

import { Url } from '../../../helpers'

export class NxtWebsocketClientService {

    private sockets: Array<{ path: string, url: Url, socket: SocketIOClient.Socket }> = []

    public createSocket (url: Url, path: string = '', query: string = '') {
        if (this.sockets.find((sock) => sock.path === path && sock.url.getUrl() === url.getUrl()) === undefined) {
            this.sockets.push({ path, url, socket: SocketIOClient(url.getUrl(), { path, query }) })
        }
    }

    public emit (url: Url, path: string = '', event: string, ...args: any[]) {
        const socket = this.sockets.find((sock) => sock.path === path && sock.url.getUrl() === url.getUrl())

        if (socket) {
            socket.socket.emit(event, ...args)
        }
    }

    public on (url: Url, path: string = '', event: string, callback: (...args: any[]) => void) {
        const socket = this.sockets.find((sock) => sock.path === path && sock.url.getUrl() === url.getUrl())

        if (socket) {
            socket.socket.on(event, callback)
        }
    }

    public disconnect (url: Url, path: string = '') {
        const index = this.sockets.reduce((p, c, i) => (c.path === path && c.url.getUrl() === url.getUrl()) ? i : p, -1)

        if (index > -1) {
            this.sockets[index].socket.disconnect()
            this.sockets.splice(index, 1)
        }
    }

}
