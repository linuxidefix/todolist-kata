import { Component, ElementRef, Inject, ViewEncapsulation } from '@angular/core'

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'nxt-tooltip',
    styles: [
        require('./_nxt-tooltip.component.scss'),
    ],
    template: `
        <div class="nxt-tooltip-container" [ngClass]="position">
            <div class="nxt-tooltip-content" [innerHtml]="content"></div>
        </div>
    `,
})

export class NxtTooltipComponent {
    public content: string
    public position: string // (top|right|bottom|left|middle)

    private parentElement: Element

    private tooltipElement: HTMLElement

    constructor (
        @Inject(HTMLElement) parentElement: HTMLElement,
        @Inject('content') content: string,
        @Inject('position') position: string,
        tooltipElement: ElementRef,
    ) {
        this.parentElement = parentElement

        this.content = content

        this.position = position
        this.tooltipElement = tooltipElement.nativeElement
    }

    public ngOnInit () {
        this.placeTooltip()
    }

    private placeTooltip () {
        let tooltipPosition: ITooltipPosition

        switch (this.position) {
            case 'middle':
                tooltipPosition = this.getMiddlePosition()
                break
            case 'right':
                tooltipPosition = this.getRightPosition()
                break
            case 'left':
                tooltipPosition = this.getLeftPosition()
                break
            case 'bottom':
                tooltipPosition = this.getBottomPosition()
                break
            default:
                this.position = 'top'
                tooltipPosition = this.getTopPosition()
        }

        this.tooltipElement.style.top = `${tooltipPosition.y}px`
        this.tooltipElement.style.left = `${tooltipPosition.x}px`
        this.tooltipElement.style.transform = `translate(${tooltipPosition.translateX}, ${tooltipPosition.translateY})`
    }

    private getMiddlePosition (): ITooltipPosition {
        const parentPosition: ClientRect = this.parentElement.getBoundingClientRect()

        const x: number = parentPosition.left + (parentPosition.width / 2)
        const y: number = parentPosition.top + (parentPosition.height / 2)

        return {
            translateX: '-50%',
            translateY: '-50%',
            x,
            y,
        }
    }

    private getTopPosition (): ITooltipPosition {
        const parentPosition = this.parentElement.getBoundingClientRect()

        const x: number = parentPosition.left + (parentPosition.width / 2)
        const y: number = document.documentElement.scrollTop ? parentPosition.top + document.documentElement.scrollTop : parentPosition.top + document.body.scrollTop

        return {
            translateX: '-50%',
            translateY: '-125%',
            x,
            y,
        }
    }

    private getBottomPosition (): ITooltipPosition {
        const parentPosition = this.parentElement.getBoundingClientRect()

        const x: number = parentPosition.left + (parentPosition.width / 2)
        const y: number = parentPosition.top + parentPosition.height

        return {
            translateX: '-50%',
            translateY: '10%',
            x,
            y,
        }
    }

    private getLeftPosition (): ITooltipPosition {
        const parentPosition = this.parentElement.getBoundingClientRect()

        const x: number = parentPosition.left
        const y: number = parentPosition.top + (parentPosition.height / 2)

        return {
            translateX: '-109%',
            translateY: '-50%',
            x,
            y,
        }
    }

    private getRightPosition (): ITooltipPosition {
        const parentPosition = this.parentElement.getBoundingClientRect()

        const x: number = parentPosition.right
        const y: number = parentPosition.top + (parentPosition.height / 2)

        return {
            translateX: '10%',
            translateY: '-50%',
            x,
            y,
        }
    }
}

interface ITooltipPosition {
    translateX: string
    translateY: string
    x: number
    y: number
}
