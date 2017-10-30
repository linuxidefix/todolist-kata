import { select } from '@angular-redux/store'
import { Inject } from '@angular/core'
import { Headers, Http, RequestOptions, Response } from '@angular/http'
import { Observable, Subject } from 'rxjs'

import { AppActions, appConfig, IAppState } from '../../../app'
import { createCookie, getCookie, Url } from '../../../helpers'

export class NxtApiService {
    private http: Http
    private cache: any[] = []
    private queue: string[] = []
    private queue$: Subject<string[]> = new Subject<string[]>()

    // Redux
    @select((state: { appState: IAppState }) => state.appState.cache) private appState$: Observable<any[]>
    private appStore

    constructor (
        @Inject(Http) http: Http,
        @Inject('AppStore') appStore,
    ) {
        this.http = http
        this.appStore = appStore

        this.appState$.subscribe((cache: any[]) => {
            if (cache !== this.cache) {
                this.cache = cache
            }
        })
    }

    public get (url: Url, cache: boolean = false, cacheDuration: number = 3600): Promise<any> {
        const cachedData = this.cache.filter((c) => c.url === url.getUrl())

        if (cachedData.length > 0) {
            const expires = new Date(cachedData[0].expires)
            const now = new Date()

            if (expires.getTime() > now.getTime()) {
                return Promise.resolve(cachedData[0].data)
            } else {
                this.appStore.dispatch(AppActions.setCache(this.cache.filter((c) => c.url !== url.getUrl())))
            }
        }

        if (cache && this.queue.filter((q) => q === url.getUrl()).length > 0) {
            return new Promise((resolve, reject) => {
                const subsciption = this.queue$.subscribe((queue) => {
                    if (queue.filter((q) => q === url.getUrl()).length === 0) {
                        resolve(this.get(url, cache))

                        subsciption.unsubscribe()
                    }
                })
            })
        } else {
            this.queue.push(url.getUrl())

            return this.authorizationHeader()
                .then((headersObj) => {
                    const headers = new Headers({ ...headersObj })
                    const options = new RequestOptions({ headers })

                    return this.http.get(url.getUrl(), options).toPromise()
                })
                .then(this.extractData)
                .then((data) => {
                    if (cache) {
                        const date = new Date()
                        date.setTime(date.getTime() + (cacheDuration * 1000))

                        const dataToCache = { data, expires: date.toUTCString(), url: url.getUrl() }

                        this.appStore.dispatch(AppActions.setCache([ ...this.cache, dataToCache ]))
                    }

                    this.queue = this.queue.filter((q) => q !== url.getUrl())
                    this.queue$.next(this.queue)

                    return data
                })
        }
    }

    public post (url: Url, body: any): Promise<any> {
        return this.authorizationHeader()
            .then((headersObj) => {
                const headers = new Headers({ ...headersObj, 'Content-Type': 'application/json' })
                const options = new RequestOptions({ headers })

                return this.http
                    .post(url.getUrl(), JSON.stringify(body), options)
                    .toPromise()
                    .then(this.extractData)
            })
    }

    public put (url: Url, body: any): Promise<any> {
        return this.authorizationHeader()
            .then((headersObj) => {
                const headers = new Headers({ ...headersObj, 'Content-Type': 'application/json' })
                const options = new RequestOptions({ headers })

                return this.http
                    .put(url.getUrl(), JSON.stringify(body), options)
                    .toPromise()
                    .then(this.extractData)
            })
    }

    public patch (url: Url, body: any): Promise<any> {
        return this.authorizationHeader()
            .then((headersObj) => {
                const headers = new Headers({ ...headersObj, 'Content-Type': 'application/json' })
                const options = new RequestOptions({ headers })

                return this.http
                    .patch(url.getUrl(), JSON.stringify(body), options)
                    .toPromise()
                    .then(this.extractData)
            })
    }

    public delete (url: Url): Promise<any> {
        return this.authorizationHeader()
            .then((headersObj) => {
                const headers = new Headers({ ...headersObj, 'Content-Type': 'application/json' })
                const options = new RequestOptions({ headers })

                return this.http
                    .delete(url.getUrl(), options)
                    .toPromise()
                    .then(this.extractData)
            })
    }

    public uploadFile (url: Url, formData: FormData) {
        return this.authorizationHeader()
            .then((headersObj) => {
                return new Promise((resolve, reject) => {
                    const xhr: XMLHttpRequest = new XMLHttpRequest()

                    xhr.onreadystatechange = () => {
                        if (xhr.readyState === 4) {
                            let response = null

                            try {
                                response = JSON.parse(xhr.response)
                            } catch (e) {
                                response = {}
                            }

                            if (xhr.status === 200) {
                                resolve(response)
                            } else {
                                reject(response)
                            }
                        }
                    }

                    xhr.open('POST', url.getUrl(), true)

                    for (const header in headersObj) {
                        if (headersObj[header] !== undefined) {
                            xhr.setRequestHeader(header, headersObj[header])
                        }
                    }

                    xhr.send(formData)
                })
            })
    }

    public oauth (username: string, password: string, persist: boolean = false): Promise<any> {
        const body = {
            client_id: appConfig.oauth.clientId,
            client_secret: appConfig.oauth.clientSecret,
            grant_type: 'password',
            password,
            username,
        }

        return this.oauthRequest(body)
    }

    public oauthRefreshToken (refreshToken: string): Promise<any> {
        const body = {
            client_id: appConfig.oauth.clientId,
            client_secret: appConfig.oauth.clientSecret,
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        }

        return this.oauthRequest(body)
    }

    public handleError (error: any) {
        return Promise.reject(error)
    }

    public isLogged (): boolean {
        const accessToken = getCookie('oauth')

        if (accessToken !== false) {
            const now = new Date()
            const expires = new Date(accessToken.token_expires)
            const refreshExpires = new Date(accessToken.refresh_expires)

            return expires > now || refreshExpires > now
        }

        return false
    }

    public extractAccessToken (response): any {
        const tokenExpires = new Date()
        tokenExpires.setTime(tokenExpires.getTime() + (response.expires_in * 1000))

        const refreshExpires = new Date()
        refreshExpires.setTime(refreshExpires.getTime() + (1000 * 3600 * 24 * 14))

        const accessToken = {
            access_token: response.access_token,
            refresh_expires: refreshExpires,
            refresh_token: response.refresh_token,
            scope: response.scope,
            token_expires: tokenExpires,
            token_type: response.token_type,
        }

        createCookie('oauth', accessToken, 14)

        return accessToken
    }

    private oauthRequest (body: any): Promise<any> {
        const url = new Url(appConfig.api.protocol, appConfig.api.domain, appConfig.api.oauthPath)

        const headers = new Headers({'Content-Type': 'application/json'})
        const options = new RequestOptions({ headers })

        return this.http
            .post(url.getUrl(), JSON.stringify(body), options)
            .toPromise()
            .then(this.extractData)
            .then(this.extractAccessToken)
    }

    private authorizationHeader (): Promise<any> {
        const accessToken = getCookie('oauth')

        if (accessToken !== false) {
            const now = new Date()
            const expires = new Date(accessToken.token_expires)
            const refreshExpires = new Date(accessToken.refresh_expires)

            if (expires > now) {
                return new Promise((resolve, reject) => {
                    resolve({ Authorization: `Bearer ${accessToken.access_token}` })
                })
            } else if (refreshExpires > now) {
                return this.oauthRefreshToken(accessToken.refresh_token)
                    .then((response) => {
                        return { Authorization: `Bearer ${response.access_token}` }
                    })
            }
        }

        return new Promise((resolve, reject) => {
            resolve({})
        })
    }

    private extractData (res: Response) {
        const body = res.json()

        return body || {}
    }
}
