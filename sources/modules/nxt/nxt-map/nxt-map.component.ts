import { Component, ElementRef, Inject, Input, ViewEncapsulation } from '@angular/core'
import { control, geoJson, Icon, ILayer, LatLng, Map, marker, tileLayer } from 'leaflet'

import { ICoordinates } from '../../../helpers'
import { NxtMapService } from './'

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'nxt-map',
    styles: [
        require('../../../../node_modules/leaflet/dist/leaflet.css'),
        require('./_nxt-map.component.scss'),
    ],
    template: `
        <div class="map"></div>
    `,
})

export class NxtMapComponent {
    public currentYear: number

    @Input('centerLat') private centerLat: number = 48.853
    @Input('centerLng') private centerLng: number = 2.348
    @Input('centerZoom') private centerZoom: number = 18
    @Input('zoomPosition') private zoomPosition: string = 'bottomright'
    @Input('urlBaseMap') private urlBaseMap: string = ''
    @Input('attribution') private attribution: string = ''

    private map: Map = null
    private geoJson: any = null
    private markersObj: any[] = []
    private el: ElementRef
    private layers: any[] = []

    private nxtMapService: NxtMapService

    constructor (
        el: ElementRef,
        @Inject(NxtMapService) nxtMapService: NxtMapService,
    ) {
        this.el = el

        this.nxtMapService = nxtMapService
    }

    public ngAfterViewInit () {
        this.mapInit()
        this.addMapEngine()
        this.initZoomCtrl()

        setTimeout(() => {
            this.map.invalidateSize(false)
        }, 500)

        this.nxtMapService.on(this, 'setOutline', (geoJsonObj, color: string = '#ffffff') => {
            if (this.geoJson !== null) {
                this.map.removeLayer(this.geoJson)
            }

            this.geoJson = geoJson(geoJsonObj, {
                style: () => {
                    return {
                        color,
                        dashArray: '3',
                        fillOpacity: 0,
                        opacity: 1,
                        weight: 2,
                    }
                },
            })
            const bounds = this.geoJson.getBounds()

            this.map.addLayer(this.geoJson)
            this.map.fitBounds(bounds)

            this.geoJson.on('click', (e) => {
                this.nxtMapService.dispatch('clickOnGeoJson', e)
            })
        })

        this.nxtMapService.on(this, 'addMarker', (coordinates: LatLng) => {
            this.addMarker({ lat: coordinates.lat, lng: coordinates.lng }, this.initIconMarker())
        })

        this.nxtMapService.on(this, 'removeMarker', (index) => {
            this.removeMarker(index)
        })

        this.nxtMapService.on(this, 'panTo', (coordinate, zoom) => {
            this.panTo(coordinate, zoom)
        })

        this.nxtMapService.on(this, 'addLayer', (layer: ILayer) => {
            if (Array.isArray(layer)) {
                layer.forEach((l) => {
                    this.map.addLayer(l)
                    this.layers.push(l)
                })
            } else {
                 this.map.addLayer(layer)

                 this.layers.push(layer)
            }
        })

        this.nxtMapService.on(this, 'clearMap', () => {
            this.layers.forEach((layer) => {
                this.map.removeLayer(layer)
            })

            if (this.geoJson !== null) {
                this.map.removeLayer(this.geoJson)
            }
        })

        this.nxtMapService.dispatch('loaded')
    }

    /**
     * Déplacement de la carte vers les coordonnées renseignées
     * @param {lat, lng}
     * @param {number} zoom
     */
    private panTo ({ lat, lng }, zoom) {
        this.map.panTo(new LatLng(lat, lng), {
            animate: true,
            duration: 0.5,
        })

        this.centerLat = lat
        this.centerLng = lng
        this.centerZoom = zoom

        setTimeout(() => {
            this.map.setZoom(zoom)
        }, 550)
    }

    // Calls definition

    /**
     * Initialisation de la map
     */
    private mapInit () {
        this.map = new Map(this.el.nativeElement.querySelector('.map'), {
            center: new LatLng(this.centerLat, this.centerLng),
            // maxZoom: appParams.map.maxZoom,
            // minZoom: appParams.map.minZoom,
            zoom: this.centerZoom,
            zoomControl: false,
        })

        this.map.on('click', (e) => {
            this.nxtMapService.dispatch('clickOnMap', e)
        })
    }

    /**
     * Retourne un Icon pour un marqueur
     * @return {Icon}
     */
    private initIconMarker (): Icon {
        return new Icon({
            iconAnchor: [12.5, 41], // point of the icon which will correspond to marker's location
            iconSize: [25, 41], // size of the icon
            iconUrl: '/img/marker-icon-2x.png',
            popupAnchor: [12.5, -36], // point from which the popup should open relative to the iconAnchor
            shadowAnchor: [6.5, 21],  // the same for the shadow
            shadowSize: [20.5, 20.5], // size of the shadow
            shadowUrl: '/img/marker-shadow.png',
        })
    }

    /**
     * Ajout du marqueur sur la carte
     */
    private addMarker (coordinates: ICoordinates, markerEl) {
        // On ajoute le marqueur sur la carte
        this.markersObj.push(marker([coordinates.lat, coordinates.lng], {icon: markerEl}))
        this.map.addLayer(this.markersObj[this.markersObj.length - 1])
    }

    /**
     * Suppression du marqueur sur la carte
     */
    private removeMarker (index: number) {
        if (this.markersObj[index] !== null && this.markersObj[index] !== undefined) {
            this.map.removeLayer(this.markersObj[index])

            this.markersObj = [...this.markersObj.splice(0, index), ...this.markersObj.splice(index + 1)]
        }
    }

    /**
     * Ajout du controlleur de zoom sur la map
     */
    private initZoomCtrl () {
        if (this.zoomPosition !== 'none') {
            let zoomCtrl = null
            switch (this.zoomPosition) {
                case 'topleft':
                    zoomCtrl = control.zoom({
                        position: 'topleft',
                    })
                    break
                case 'topright':
                    zoomCtrl = control.zoom({
                        position: 'topright',
                    })
                    break
                case 'bottomleft':
                    zoomCtrl = control.zoom({
                        position: 'bottomleft',
                    })
                    break
                default:
                    zoomCtrl = control.zoom({
                        position: 'bottomright',
                    })
            }

            zoomCtrl.addTo(this.map)
        }
    }

    /**
     * Ajout du moteur de carte sur la map
     */
    private addMapEngine () {
        // var googleLayer = new Google('ROADMAP')

        const mapLayer = tileLayer(this.urlBaseMap, {
            attribution: this.attribution,
            maxZoom: 18,
        })

        this.map.addLayer(mapLayer)
    }
}
