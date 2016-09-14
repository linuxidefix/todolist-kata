export { Url } from './url.class'
export * from './interfaces'
export { EventsService } from './events.service'
export { DynamicComponent } from './dynamic-component'

export function numberFormat (number, decimals, dec_point, thousands_sep) {
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '')
    let n = !isFinite(+number) ? 0 : + number
    let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
    let sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep
    let dec = (typeof dec_point === 'undefined') ? '.' : dec_point
    let s = ''
    let toFixedFix = (n, prec) => {
        let k = Math.pow(10, prec)
        return '' + Math.round(n * k) / k
    }

    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    let sA = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
    if (sA[0].length > 3) {
        sA[0] = sA[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
    }
    if ((sA[1] || '').length < prec) {
        sA[1] = sA[1] || ''
        sA[1] += new Array(prec - sA[1].length + 1).join('0');
    }

    return sA.join(dec)
}
