import { ApplicationRef, Component, Injector, Input, OnChanges, SimpleChange, ViewContainerRef, ViewEncapsulation, ViewRef } from '@angular/core'
import { interpolate, layout, max, scale, select, svg } from 'd3'

import { NxtTooltipService } from '../nxt-tooltip'

@Component({
    encapsulation: ViewEncapsulation.None,
    providers: [ NxtTooltipService ],
    selector: 'nxt-chart',
    styles: [
        require('./_nxt-chart.component.scss'),
    ],
    template: `<svg class="d3-stats"></svg>`,
})

export class NxtChartComponent implements OnChanges {
    @Input() private type: string // (rectangles|arcs)
    @Input() private data: INxtChartData[]

    private d3Container

    private viewRootContainerRef: ViewContainerRef
    private nxtTooltipService: NxtTooltipService
    private viewRef: ViewRef

    constructor (
        applicationRef: ApplicationRef,
        injector: Injector,
        nxtTooltipService: NxtTooltipService,
    ) {
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
            case 'progressbar':
                this.setProgressBar()
                break
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
        const self = this
        const size: number = 150
        const rules = this.getArcsRules()
        let current = {
            endAngle: 0,
            startAngle: 0,
        }

        this.d3Container.selectAll('path').remove()

        const arcs = this.d3Container.selectAll('path')
            .data(rules.pie(this.data.map((d) => d.value)))

        const g = arcs
            .enter()
            .append('g')
            .attr('transform', `translate(${size}, ${size})`)

        g
            .append('path')
            .attr('fill', (d, i) => rules.color('' + i))
            .each((d) => current = d)
            .transition()
            .duration(1000)
            .attrTween('d', (d) => {
                d.startAngle += 0.01
                const interStart = interpolate(current.startAngle, d.startAngle)
                const interEnd = interpolate(current.endAngle, d.endAngle)

                current.startAngle = interStart(0)
                current.endAngle = interEnd(0)

                return (t) => {
                    const start = interStart(t)
                    const end = interEnd(t)

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
                const median = d.startAngle + ((d.endAngle - d.startAngle) / 2)
                const quarter = Math.PI / 2
                const half = Math.PI
                const threeQuarter = 3 * Math.PI / 2
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

                const left = 10 * x
                const top = 10 * y

                select(this.previousSibling).attr('transform', `translate(${left}, ${top})`)

                self.popTooltip(i, this.previousSibling)
            })
            .on('mouseout', function (d, i) {
                select(this.previousSibling).attr('transform', `translate(0, 0)`)

                self.closeTooltip()
            })
    }

    private getArcsRules () {
        const r = 130

        const arc = svg.arc()
            .innerRadius(r - 75)
            .outerRadius(r)

        const color = scale.ordinal()
            .range(this.data.map((d) => d.color))
            .domain(this.data.map((d, i) => '' + i))

        const pie = layout.pie()
            .value((d, i) => d)
            .sort(null)

        return {
            arc,
            color,
            pie,
        }
    }

    private setProgressBar () {
        this.d3Container.selectAll('rect').remove()
        this.d3Container.selectAll('text').remove()
        const rects = this.d3Container.selectAll('rect')
            .data(this.data, (d) =>  d.index)
        const texts = this.d3Container.selectAll('text')
            .data(this.data, (d) =>  d.index)

        // Ajouter le fond de la barre de progression
        rects
            .enter()
            .append('rect')
            .attr('fill', '#ccc')
            .attr('width', 300)
            .attr('height', 40)

        // Ajouter la barre à faire progresser
        rects
            .enter()
            .append('rect')
            .attr('fill', (d) => d.color)
            .attr('width', 0)
            .attr('height', 40)

        // Ajouter le texte qui indique le pourcentage
        texts
            .enter()
            .append('text')
            .text('0%')
            .attr('width', 20)
            .attr('height', 40)
            .attr('fill', '#ffffff')
            .attr('x', 140)
            .attr('y', 25)

        // Animer le text et la barre
        texts
            .transition()
            .duration(1000)
            .tween('text', (d) => {
                const i = interpolate(0, d.value)
                return function (t) {
                    select('text').text(Math.round(i(t)) + '%')
                }
            })

        rects
            .transition()
            .duration(1000)
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', (d) => d.value * 3)
    }

    private setRectangles () {
        const self = this
        const rules = this.getRectangleRules()
        this.d3Container.selectAll('rect').remove()

        const rects = this.d3Container.selectAll('rect')
            .data(this.data, (d) =>  d.index)

        rects
            .enter()
            .append('rect')
            .attr('fill', (d) => rules.color(d.index))
            .attr('width', (d) => rules.x(0))
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
            .attr('y', (d) => rules.y(d.index))
            .attr('height', rules.y.rangeBand())
            .attr('width', (d) => rules.x(d.value))
    }

    private getRectangleRules () {
        const maxCount = max(this.data, (d) => d.value)

        const x = scale.linear()
            .range([0, 300])
            .domain([0, maxCount])

        const y = scale.ordinal()
            .rangeRoundBands([0, 75])
            .domain(this.data.map((d) => d.index))

        const color = scale.ordinal()
            .range(this.data.map((d) => d.color))
            .domain(this.data.map((d) => d.index))

        return {
            color,
            x,
            y,
        }
    }

    private popTooltip (i: number, element: HTMLElement) {
        const max: number = this.data.map((d) => d.value).reduce((p, c) => p + c, 0)
        const dataRow = this.data[i]
        const percentage = Math.round((dataRow.value / max) * 10000) / 100
        const tooltipText = `
            <span class="nxt-chart-tooltip-label">${dataRow.label}</span>
            <br />
            <span class="nxt-chart-tooltip-percentage">${percentage}%</span>
        `

        this.nxtTooltipService.pop(tooltipText, element, 'top')
            .then((viewRef) => {
                this.viewRef = viewRef
            })
    }

    private closeTooltip () {
        this.nxtTooltipService.close(this.viewRef)
    }
}

export interface INxtChartData {
    index: string
    label: string
    value: number
    color: string
}
