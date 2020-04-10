import { CircleMarker, Map, MarkerClusterGroup } from 'leaflet'

import { ILocationData, locationData } from './location-data'

interface ILocation extends ILocationData {
  marker: CircleMarker
  tagMap: {[tag: string]: true}
}

type FilterType = 'categories' | 'tags'

export class LocationMarkers {
  private groups: {[category: string]: MarkerClusterGroup} = {}
  private groupColors: {[category: string]: string} = {}
  private categories: {[category: string]: number} = {}
  private tags: {[tag: string]: number} = {}
  private filters: {[filterType: string]: null | string} = {
    categories: null,
    tags: null,
  }
  private colors = [
    '255,0,0',
    '0,255,0',
    '0,0,255',
    '255,255,0',
    '0,255,255',
    '255,0,255',
    '128,0,0',
    '0,128,0',
    '128,0,128',
    '0,128,128',
    '0,0,128',
  ]
  private markers: ILocation[] = []
  private map: Map

  constructor(map: Map) {
    this.map = map
  }

  public async refresh(): Promise<void> {
    const locations = await locationData.getData()
    this.markers = locations.map((data) => {
      const location: ILocation = {
        marker: L.circleMarker(data.coordinates),
        tagMap: {},
        ...data,
      }
      location.marker.bindPopup(`<strong>${location.name}</strong>
        <span class="popup-category">${location.category}</span>
        <p class="popup-description">${location.description}</p>
        <ul class="links">
          ${location.webUrl ? `<li><a href="${location.webUrl}" target="_blank">Web</a></li>` : ''}
          ${location.whatsAppUrl ? `<li><a href="${location.whatsAppUrl}" target="_blank">WhatsApp</a></li>` : ''}
          ${location.email ? `<li><a href="mailto:${location.email}" target="_blank">${location.email}</a></li>` : ''}
          ${location.telephone ? `<li><a href="tel:${location.telephone}" target="_blank">${location.telephone}</a></li>` : ''}
        </ul>
        ${location.tags.map((tag) => `<span class="popup-tag">${tag}</span>`).join('')}`)
      if (!this.groups[location.category]) {
        const color = this.colors.shift() as string
        this.groupColors[location.category] = color
        this.groups[location.category] = L.markerClusterGroup({
          iconCreateFunction: (cluster) => {
            return new L.DivIcon({
              className: 'marker-cluster',
              html: `<div style="background-color: ${this.color(color, 0.6)}"><span>${cluster.getChildCount()}</span></div>`,
              iconSize: new L.Point(40, 40),
            })
          },
        }).on(
          'layeradd', (event) => event.layer.setStyle({color: this.color(color)}),
        ).addTo(this.map)
      }
      location.tags.forEach((tag) => {
        this.tags[tag] = this.tags[tag] || 0 + 1
        location.tagMap[tag] = true
      })
      this.categories[location.category] = this.categories[location.category] || 0 + 1
      return location
    })
    this.updateFilterContent('categories')
    this.updateFilterContent('tags')
    this.filter()
  }

  public filter(type?: FilterType, value?: string) {
    if (!type) {
      this.filters.categories = null
      this.filters.tags = null
    } else if (!value) {
      this.filters[type] = null
    } else {
      this.filters[type] = value
    }
    const tag = this.filters.tags
    const category = this.filters.categories
    Object.keys(this.groups).forEach((key) => {
      this.groups[key].clearLayers()
    })
    this.markers
    .filter((location) => {
      return tag ? location.tagMap[tag] : true
    })
    .forEach((location) => {
      if (!category || category === location.category) {
        this.groups[location.category].addLayer(location.marker)
      }
    })
    if (type) {
      this.setActiveTag(type, value)
    }
  }

  private updateFilterContent(type: FilterType) {
    const container = document.getElementById(type) as HTMLElement
    let li: HTMLLIElement
    let anchor: HTMLAnchorElement
    let span: HTMLSpanElement
    container.innerHTML = ''
    li = document.createElement('li')
    li.dataset.match = 'all'
    li.classList.add('active', 'all')
    li.onclick = () => this.filter(type)
    anchor = document.createElement('a')
    anchor.innerHTML = `all ${type}`
    li.appendChild(anchor)
    container.appendChild(li)
    Object.keys(this[type]).forEach((item) => {
      li = document.createElement('li')
      li.dataset.match = item
      li.onclick = () => {
        this.filter(type, item)
      }
      anchor = document.createElement('a')
      anchor.innerHTML = item
      if (type === 'categories') {
        span = document.createElement('span')
        span.innerHTML = 'o '
        span.style.color = this.color(this.groupColors[item])
        anchor.prepend(span)
      }
      li.appendChild(anchor)
      container.appendChild(li)
    })
  }

  private setActiveTag(type: FilterType, value?: string) {
    const match = value ? value : 'all'
    const elements = document.getElementById(type)!.children
    for (let i = 0; i < elements.length; i++) {
      const element = elements.item(i) as HTMLElement
      if (element!.dataset.match === match) {
        element!.classList.add('active')
      } else {
        element!.classList.remove('active')
      }
    }
  }

  private color(rgb: string, opacity?: number): string {
    opacity = opacity || 1
    return `rgba(${rgb},${opacity})`
  }

}
