import { ElementRef, Inject, ViewEncapsulation } from '@angular/core'

import { BaseComponent, ComponentComplement } from '../../base.component'
import { IPosition } from '../../helpers'

@ComponentComplement({
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

export class NxtTooltipComponent extends BaseComponent {
    public content: string
    public position: string // (top|right|bottom|left|middle)

    private parentElement: Element

    private tooltipElement: HTMLElement

    constructor (
        @Inject(HTMLElement) parentElement: HTMLElement,
        @Inject('content') content: string,
        @Inject('position') position: string,
        tooltipElement: ElementRef
    ) {
        super()

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
        let parentPosition: ClientRect = this.parentElement.getBoundingClientRect()

        let x: number = parentPosition.left + (parentPosition.width / 2)
        let y: number = parentPosition.top + (parentPosition.height / 2)

        return {
            translateX: '-50%',
            translateY: '-50%',
            x: x,
            y: y,
        }
    }

    private getTopPosition (): ITooltipPosition {
        let parentPosition = this.parentElement.getBoundingClientRect()

        let x: number = parentPosition.left + (parentPosition.width / 2)
        let y: number = parentPosition.top

        return {
            translateX: '-50%',
            translateY: '-100%',
            x: x,
            y: y,
        }
    }

    private getBottomPosition (): ITooltipPosition {
        let parentPosition = this.parentElement.getBoundingClientRect()

        let x: number = parentPosition.left + (parentPosition.width / 2)
        let y: number = parentPosition.top + parentPosition.height

        return {
            translateX: '-50%',
            translateY: '10%',
            x: x,
            y: y,
        }
    }

    private getLeftPosition (): ITooltipPosition {
        let parentPosition = this.parentElement.getBoundingClientRect()

        let x: number = parentPosition.left
        let y: number = parentPosition.top + (parentPosition.height / 2)

        return {
            translateX: '-100%',
            translateY: '-50%',
            x: x,
            y: y,
        }
    }

    private getRightPosition (): ITooltipPosition {
        let parentPosition = this.parentElement.getBoundingClientRect()

        let x: number = parentPosition.right
        let y: number = parentPosition.top + (parentPosition.height / 2)

        return {
            translateX: '10%',
            translateY: '-50%',
            x: x,
            y: y,
        }
    }
}

interface ITooltipPosition extends IPosition {
    translateX: string
    translateY: string
}
