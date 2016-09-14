export class Url {
    private protocol: string
    private domain: string
    private path: string
    private queryString: any

    public constructor (protocol: string = '', domain: string = '', path: string = '', queryString: any = {}) {
        this.protocol = protocol
        this.domain = domain
        this.path = path
        this.queryString = queryString
    }

    public setUrl (protocol: string = '', domain: string = '', path: string): Url {
        this.protocol = protocol
        this.domain = domain
        this.path = path

        return this
    }

    public setProtocol (protocol: string = ''): Url {
        this.protocol = protocol

        return this
    }

    public setDomain (domain: string = ''): Url {
        this.domain = domain

        return this
    }

    public setPath (path: string = ''): Url {
        this.path = path

        return this
    }

    public setQueryString (queryString: any = {}): Url {
        this.queryString = queryString

        return this
    }

    public getUrl (): string {
        let queryString: string = ''

        for (let prop in this.queryString) {
            if (this.queryString.hasOwnProperty(prop)) {
                if (queryString === '') {
                    queryString += '?'
                } else {
                    queryString += '&'
                }

                queryString += `${prop}=${this.queryString[prop]}`
            }
        }

        return `${this.protocol}://${this.domain}/${this.path}${queryString}`
    }

    public getProtocol (): string {
        return this.protocol
    }

    public getDomain (): string {
        return this.domain
    }

    public getPath (): string {
        return this.path
    }

    public getQueryString (): any {
        return this.queryString
    }
}
