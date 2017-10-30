export { Url } from './url.class'
export { DynamicComponent } from './dynamic-component'
export { EventsService } from './events.service'
export * from './interfaces'

export function numberFormat (nb, decimals, decPoint, thousandsSep) {
    nb = (nb + '').replace(/[^0-9+\-Ee.]/g, '')
    const n = !isFinite(+nb) ? 0 : + nb
    const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
    const sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
    const dec = (typeof decPoint === 'undefined') ? '.' : decPoint
    const toFixedFix = (nu, pr) => {
        const k = Math.pow(10, pr)
        return '' + Math.round(nu * k) / k
    }

    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    const sA = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
    if (sA[0].length > 3) {
        sA[0] = sA[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
    }
    if ((sA[1] || '').length < prec) {
        sA[1] = sA[1] || ''
        sA[1] += new Array(prec - sA[1].length + 1).join('0')
    }

    return sA.join(dec)
}

/**
 * Set a cookie
 * @param {string} name: Name of the cookie
 * @param {object} value: value of the cookie
 * @param {number} days: Days before expiration
 */
export function createCookie (name, value, days) {
    let expires = ''
    if (days) {
        const date = new Date()
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
        expires = ';expires= ' + date.toUTCString()
    }

    document.cookie = name + '=' + encodeURIComponent(JSON.stringify(value)) + expires + '; path=/'
}

/**
 * Delete a cookie
 * @param {string} name: Name of the cookie
 */
export function deleteCookie (name) {
    if (getCookie(name) !== false) {
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/'
    }
}

/**
 * Get a cookie by its name
 * @param {string} name: Name of the cookie
 * @return {any}
 */
export function getCookie (name): any {
    const cookies = document.cookie.split(';')
    let value = false

    cookies.forEach((val, key) => {
        const pair = val.trim().split('=')

        if (pair[0] === name) {
            value = JSON.parse(decodeURIComponent(pair[1]))
        }
    })

    return value
}

export function ucFirst (str: string) {
    str += ''
    const f = str.charAt(0).toUpperCase()

    return f + str.substr(1)
}
