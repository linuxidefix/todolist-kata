import { ApplicationRef, Injector, Input, OnChanges, SimpleChange, ViewContainerRef, ViewEncapsulation, ViewRef } from '@angular/core'
import { interpolate, layout, max, scale, select, svg } from 'd3'

import { BaseComponent, ComponentComplement } from '../../base.component'
import { NxtTooltipService } from '../nxt-tooltip'

@ComponentComplement({
    encapsulation: ViewEncapsulation.None,
    providers: [ NxtTooltipService ],
    selector: 'nxt-chart',
    styles: [
        require('./_nxt-chart.component.scss'),
    ],
    template: `<svg class="d3-stats"></svg>`,
})

export abstract class NxtChartComponent extends BaseComponent implements OnChanges {
    @Input() private type: string // (rectangles|arcs)
    @Input() private data: INxtChartData[]

    private d3Container

    private viewRootContainerRef: ViewContainerRef
    private nxtTooltipService: NxtTooltipService
    private viewRef: ViewRef

    constructor (
        applicationRef: ApplicationRef,
        injector: Injector,
        nxtTooltipService: NxtTooltipService
    ) {
        super()

        this.type = 'rectangles'
        this.data = []
        this.d3Container = null

        this.viewRootContainerRef = injector.get(applicationRef.componentTypes[0]).viewContainerRef
        this.nxtTooltipService = nxtTooltipService
    }

    public ngOnInit () {
        this.d3Container = select('.d3-stats')
        this.d3Container.size()

        switch (this.type) {
            case 'arcs':
                this.setArcs()
                break
            case 'rectangles':
            default:
                this.setRectangles()
        }
    }

    public ngOnChanges (changes: {[propKey: string]: SimpleChange}) {
        if (changes['data'].previousValue !== changes['data'].currentValue) {
            this.data = changes['data'].currentValue

            this.ngOnInit()
        }
    }

    private setArcs () {
        let self = this
        let size: number = 150
        let rules = this.getArcsRules()
        let current = {
            endAngle: 0,
            startAngle: 0,
        }

        this.d3Container.selectAll('path').remove()

        let arcs = this.d3Container.selectAll('path')
            .data(rules.pie(this.data.map(d => d.value)))

        let g = arcs
            .enter()
            .append('g')
            .attr('transform', `translate(${size}, ${size})`)

        g
            .append('path')
            .attr('fill', (d, i) => rules.color('' + i))
            .each(d => current = d)
            .transition()
            .duration(1000)
            .attrTween('d', d => {
                d.startAngle += 0.01
                let interStart = interpolate(current.startAngle, d.startAngle)
                let interEnd = interpolate(current.endAngle, d.endAngle)

                current.startAngle = interStart(0)
                current.endAngle = interEnd(0)

                return t => {
                    let start = interStart(t)
                    let end = interEnd(t)

                    d.startAngle = start
                    d.endAngle = end

                    return rules.arc(d)
                }
            })

        g
            .append('path')
            .attr('d', rules.arc)
            .attr('fill-opacity', '0')
            .on('mouseover', function (d, i) {
                let median = d.startAngle + ((d.endAngle - d.startAngle) / 2)
                let quarter = Math.PI / 2
                let half = Math.PI
                let threeQuarter = 3 * Math.PI / 2
                let x = 0
                let y = 0

                if (median <= quarter) {
                    y = (quarter - median) * -1
                    x = median
                } else if (median > quarter && median <= half) {
                    y = median - quarter
                    x = quarter - y
                } else if (median > half && median <= threeQuarter) {
                    x = (median - half) * -1
                    y = quarter + x
                } else if (median > threeQuarter) {
                    y = (median - threeQuarter) * -1
                    x = (quarter + y) * -1
                }

                x /= quarter
                y /= quarter

                let left = 10 * x
                let top = 10 * y

                select(this.previousSibling).attr('transform', `translate(${left}, ${top})`)

                self.popTooltip(i, this.previousSibling)
            })
            .on('mouseout', function (d, i) {
                select(this.previousSibling).attr('transform', `translate(0, 0)`)

                self.closeTooltip()
            })
    }

    private getArcsRules () {
        let r = 130

        let arc = svg.arc()
            .innerRadius(r - 75)
            .outerRadius(r)

        let color = scale.ordinal()
            .range(this.data.map(d => d.color))
            .domain(this.data.map((d, i) => '' + i))

        let pie = layout.pie()
            .value((d, i) => d)
            .sort(null)

        return {
            arc: arc,
            color: color,
            pie: pie,
        }
    }

    private setRectangles () {
        let self = this
        let rules = this.getRectangleRules()

        this.d3Container.selectAll('rect').remove()

        let rects = this.d3Container.selectAll('rect')
            .data(this.data, d =>  d.index)

        rects
            .enter()
            .append('rect')
            .attr('fill', d => rules.color(d.index))
            .attr('width', d => rules.x(0))
            .on('mouseover', function (d, i) {
                self.popTooltip(i, this)
            })
            .on('mouseout', function (d, i) {
                self.closeTooltip()
            })

        rects
            .transition()
            .duration(1000)
            .attr('x', rules.x(0))
            .attr('y', d => rules.y(d.index))
            .attr('height', rules.y.rangeBand())
            .attr('width', d => rules.x(d.value))
    }

    private getRectangleRules () {
        let maxCount = max(this.data, d => d.value)

        let x = scale.linear()
            .range([0, 300])
            .domain([0, maxCount])

        let y = scale.ordinal()
            .rangeRoundBands([0, 75])
            .domain(this.data.map(d => d.index))

        let color = scale.ordinal()
            .range(this.data.map(d => d.color))
            .domain(this.data.map(d => d.index))

        return {
            color: color,
            x: x,
            y: y,
        }
    }

    private popTooltip (i: number, element: HTMLElement) {
        let max: number = this.data.map(d => d.value).reduce((p, c) => p + c, 0)
        let dataRow = this.data[i]
        let percentage = Math.round((dataRow.value / max) * 10000) / 100
        let tooltipText = `
            <span class="nxt-chart-tooltip-label">${dataRow.label}</span>
            <br />
            <span class="nxt-chart-tooltip-percentage">${percentage}%</span>
        `

        this.nxtTooltipService.pop(this.viewRootContainerRef, tooltipText, element, 'top')
            .then(viewRef => {
                this.viewRef = viewRef
            })
    }

    private closeTooltip () {
        this.nxtTooltipService.close(this.viewRootContainerRef, this.viewRef)
    }
}

export interface INxtChartData {
    index: string
    label: string
    value: number
    color: string
}
