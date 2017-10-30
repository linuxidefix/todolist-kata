import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core'

import { inputs, outputs } from '../nxt-form'

@Component({
    inputs,
    outputs,
    selector: 'nxt-datepicker',
    styles: [
        require('./_nxt-datepicker.component.scss'),
    ],
    template: require('./_nxt-datepicker.component.html'),
})

export class NxtDatepickerComponent {
    @Input() public label: string
    @Input() public fromDate: Date
    @Input() public toDate: Date
    @Input() public date: Date = new Date()
    @Output() public dateChange: EventEmitter<Date> = new EventEmitter<Date>()
    @Input() public placeholder: string = ''

    public showDP: boolean = false
    public isToday: boolean = true
    public showYearsList: boolean = false
    public showMonthList: boolean = false
    public years: number[] = []
    public weeks: any[] = []
    public month: number
    public year: number
    public _mString: string[] = [ 'Janvier',  'Février',  'Mars',  'Avril',  'Mai',  'Juin',  'Juillet',  'Août',  'Septembre', 'Octobre',  'Novembre',  'Decembre' ]

    public required: boolean

    private today: Date = new Date()
    private elementRef: ElementRef

    constructor (elementRef: ElementRef) {
        this.elementRef = elementRef
        this.label = ''
        this.required = false
    }

    public ngOnInit () {
        this.month = this.date.getMonth()
        this.year = this.date.getFullYear()

        const maxYear = this.toDate ? this.toDate.getFullYear() : this.today.getFullYear() + 100
        const minYear = this.fromDate ? this.fromDate.getFullYear() : this.today.getFullYear() - 100

        for (let y = minYear; y <= maxYear; y++) {
            this.years.push(y)
        }

        this.elementRef.nativeElement.querySelector('.calendar-container').addEventListener('click', (event) => {
            event.stopPropagation()
        })

        this.refreshMonth()
    }

    public toggleCalendar () {
        this.showDP = !this.showDP
    }

    public cancel ($event) {
        $event.stopPropagation()
        this.date = new Date()
        this.dateChange.emit(this.date)
        this.refreshMonth()
    }

    public prevMonth () {
        const m = this.month > 0 ? this.month - 1 : this.month = 11

        this.selectMonth(m)
    }

    public nextMonth () {
        const m = this.month < 11 ? this.month + 1 : this.month = 0

        this.selectMonth(m)
    }

    public prevYear () {
        this.selectYear(this.year - 1)
    }

    public nextYear () {
        this.selectYear(this.year + 1)
    }

    public selectDate (day, month) {
        const date = new Date()
        date.setDate(day)
        date.setFullYear(this.year)
        date.setHours(0, 0, 0, 0)

        if (month === 'prev') {
            date.setMonth((this.month > 0) ? this.month - 1 : 11)
            if (date.getMonth() === 11) {
                date.setFullYear(date.getFullYear() - 1)
            }
        } else if (month === 'next') {
            date.setMonth((this.month < 11) ? this.month + 1 : 0)
            if (date.getMonth() === 0) {
                date.setFullYear(date.getFullYear() + 1)
            }
        } else {
            date.setMonth(this.month)
        }

        if ((!this.toDate || this.toDate >= date) && (!this.fromDate || this.fromDate <= date)) {
            this.date = null
            this.date = date
            this.dateChange.emit(this.date)

            this.month = this.date.getMonth()
            this.year = this.date.getFullYear()

            this.refreshMonth()
            this.showDP = false
        }
    }

    public selectYear (y) {
        if (!this.fromDate || this.fromDate.getFullYear() < y) {
            this.year = y

            if (this.fromDate && this.fromDate.getFullYear() === this.year && this.fromDate.getMonth() > this.month) {
                this.month = this.fromDate.getMonth()
            }

            this.showYearsList = false

            this.refreshMonth()
        }
    }

    public selectMonth (m) {
        if (!this.fromDate || this.fromDate.getMonth() < m) {
            this.month = m

            this.showMonthList = false

            this.refreshMonth()
        }
    }

    public close () {
        this.showYearsList = false
        this.showMonthList = false
        this.showDP = false
    }

    private refreshMonth () {
        const month = new Date()
        let isLeapYear: boolean = false
        const _m = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

        this.weeks = []

        month.setDate(1)
        month.setMonth(this.month)
        month.setFullYear(this.year)

        isLeapYear = (month.getFullYear() % 4 === 0 && (month.getFullYear() % 100 !== 0 || month.getFullYear() % 400 === 0))
        _m[1] = isLeapYear ? 29 : 28

        let days = []
        const lastDay = (month.getDay() === 0) ? 7 : month.getDay()
        const prevMonth = (month.getMonth() - 1 < 0) ? 11 : month.getMonth() - 1

        for (let d = _m[prevMonth] - (lastDay - 1) + 1; d <= _m[prevMonth]; d++) {
            days.push({ isSelected: false, isToday: false, month: 'prev', num: d })
        }

        for (let d = 1; d <= _m[month.getMonth()]; d++) {
            let isToday = false
            let isSelected = false
            let outOfLimit = false

            if (this.today.getFullYear() === month.getFullYear() && this.today.getMonth() === month.getMonth() && this.today.getDate() === d) {
                isToday = true
            }

            if (month.getFullYear() === this.date.getFullYear() && month.getMonth() === this.date.getMonth() && this.date.getDate() === d) {
                isSelected = true
            }

            if (this.fromDate && this.fromDate.getFullYear() >= month.getFullYear() && this.fromDate.getMonth() >= month.getMonth() && this.fromDate.getDate() > d) {
                outOfLimit = true
            }

            if (this.toDate && this.toDate.getFullYear() <= month.getFullYear() && this.toDate.getMonth() <= month.getMonth() && this.toDate.getDate() < d) {
                outOfLimit = true
            }

            days.push({ isSelected, isToday, month: 'current', num: d,  outOfLimit })

            if (days.length % 7 === 0) {
                this.weeks.push(days)
                days = []
            } else if (d === _m[month.getMonth()]) {
                const length = days.length

                for (let i = 1; i <= 7 - length; i++) {
                    days.push({ isSelected: false, isToday: false, month: 'next', num: i })
                }

                this.weeks.push(days)
            }
        }

        this.isToday = this.date.getFullYear() === this.today.getFullYear() && this.date.getMonth() === this.today.getMonth() && this.date.getDate() === this.today.getDate()
    }
}
