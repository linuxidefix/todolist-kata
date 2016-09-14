import { Inject } from '@angular/core'
import { Headers, Http, RequestOptions, Response } from '@angular/http'
import { Observable } from 'rxjs/Rx'

import { Url } from '../../helpers'

export class NxtApiService {
    private http: Http

    constructor (@Inject(Http) http: Http) {
        this.http = http
    }

    public get (url: Url): Promise<any> {
        return this.http.get(url.getUrl())
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError)
    }

    public post (url: Url, body: any): Promise<any> {
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'})
        let options = new RequestOptions({ headers: headers })

        return this.http
            .post(url.getUrl(), JSON.stringify(body), options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError)
    }

    public uploadFile (url: Url, formData: FormData) {
        let promise: Promise<any> = new Promise((resolve, reject) => {
            let xhr: XMLHttpRequest = new XMLHttpRequest()

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.response))
                    } else {
                        reject(JSON.parse(xhr.response))
                    }
                }
            }

            xhr.open('POST', url.getUrl(), true)
            xhr.send(formData)
        })

        return promise
    }

    private extractData (res: Response) {
        let body = res.json()

        return body || {}
    }

    private handleError (error: any) {
        let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error'

        return Observable.throw(errMsg)
  }
}
