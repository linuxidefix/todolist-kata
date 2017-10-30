import { Observable, Subject } from 'rxjs/Rx'

import { Inject, Injectable } from '@angular/core'
import { Http, Response } from '@angular/http'

@Injectable()

export class NxtTranslateService {
    private pathFile: string
    private prefixFile: string
    private suffixFile: string
    private currentLanguage: string
    private http: Http
    private translation$: Subject<{}>
    private translation: any

    constructor (@Inject(Http) http: Http) {
        this.http = http
        this.translation$ = new Subject()
        this.translation = {}
    }

    public getTranslationObservable (): Observable<{}> {
        return this.translation$.asObservable()
    }

    public getTranslation (): any {
        return this.translation
    }

    public getCurrentLanguage (): string {
        return this.currentLanguage
    }

    public setTranslation (translateContents: any) {
        this.translation = translateContents
        this.translation$.next(translateContents)
    }

    public setFilePattern (path: string, prefix: string, suffix: string) {
        this.pathFile = path
        this.prefixFile = prefix
        this.suffixFile = suffix
    }

    public setLanguage (lang: string) {
        this.currentLanguage = lang
    }

    public setTranslateContents () {
        return this.http.get(`${this.pathFile}/${this.prefixFile}${this.currentLanguage}${this.suffixFile}`)
            .toPromise()
            .then((res) => this.extractData(res))
            .catch((error) => this.handleError(error))
    }

    private extractData (res: Response) {
        const body = res.json()

        this.setTranslation(body)

        return body
    }

    private handleError (error: any) {
        const errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error'

        return Observable.throw(errMsg)
    }
}
