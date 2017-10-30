import { Component, Input } from '@angular/core'

@Component({
    selector: 'nxt-countdown',
    styles: [
        require('./_nxt-countdown.component.scss'),
    ],
    template: `
        <span class="nxt-countdown-years" *ngIf="years > 0">{{ '{$0} year(s)' | translate: [ years ] }}</span>
        <span class="nxt-countdown-months" *ngIf="years > 0 || months > 0">{{ '{$0} month(s)' | translate: [ months ] }}</span>
        <span class="nxt-countdown-days" *ngIf="years > 0 || months > 0 || days > 0">{{ '{$0} day(s)' | translate: [ days ] }}</span>
        <span class="nxt-countdown-hours" *ngIf="years > 0 || months > 0 || days > 0 || hours > 0">{{ '{$0} hour(s)' | translate: [ hours ] }}</span>
        <span class="nxt-countdown-minutes" *ngIf="years > 0 || months > 0 || days > 0 || hours > 0 || minutes > 0">{{ '{$0} minute(s)' | translate: [ minutes ] }}</span>
        <span class="nxt-countdown-seconds" *ngIf="years > 0 || months > 0 || days > 0 || hours > 0 || minutes > 0 || seconds > 0">{{ '{$0} second(s)' | translate: [ seconds ] }}</span>

        <span class="nxt-countdown-expired" *ngIf="timeLeft <= 0">{{ 'Expired' | translate }}</span>
    `,
})

export class NxtCountdownComponent {
    @Input() public end: Date = new Date()

    public timeLeft: number = 0
    public years: number = 0
    public months: number = 0
    public days: number = 0
    public hours: number = 0
    public minutes: number = 0
    public seconds: number = 0

    private interval

    public ngOnInit () {
        this.interval = setInterval(() => {
            const now: Date = new Date()
            this.timeLeft = Math.round((this.end.getTime() - now.getTime()) / 1000)

            this.seconds = this.timeLeft
            if (this.timeLeft > 60) {
                this.seconds = Math.floor(this.timeLeft % 60)
            }

            const sPerMinutes: number = 60
            const minutesLeft: number = this.timeLeft / sPerMinutes
            this.minutes = Math.floor(minutesLeft)
            if (minutesLeft > 60) {
                this.minutes = Math.floor(minutesLeft % 60)
            }

            const sPerHours: number = sPerMinutes * 60
            const hoursLeft: number = this.timeLeft / sPerHours
            this.hours = Math.floor(hoursLeft)
            if (hoursLeft > 24) {
                this.hours = Math.floor(hoursLeft % 24)
            }

            const sPerDay: number = sPerHours * 24
            const daysLeft: number = this.timeLeft / sPerDay
            this.days = Math.floor(daysLeft)
            if (daysLeft > 30) {
                this.days = Math.floor(daysLeft % 30)
            }

            const sPerMonths: number = sPerDay * 30
            const monthsLeft: number = this.timeLeft / sPerMonths
            this.months = Math.floor(monthsLeft)
            if (monthsLeft > 12) {
                this.months = Math.floor(monthsLeft % 12)
            }

            this.years = Math.floor(daysLeft / 365)

        }, 1000)
    }

    public ngOnDestroy () {
        clearInterval(this.interval)
    }
}
