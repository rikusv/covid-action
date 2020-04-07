import { Map, TileLayer } from 'leaflet'
import { LocationMarkers } from './location-markers'

import 'leaflet'
import 'leaflet.markercluster'

import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.default.css'
import 'leaflet/dist/leaflet.css'

const map = new Map('map', {
  attributionControl: false,
})
L.control.attribution({position: 'bottomleft'}).addTo(map)

// Set view to South Africa
const topLeft: [number, number] = [-22.1, 16.4]
const bottomRight: [number, number] = [-34.8, 32.9]
map.fitBounds([topLeft, bottomRight])

// Set view to user's location if found
map.locate({setView: true, maxZoom: 12})

new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
  maxZoom: 18,
}).addTo(map)

window.addEventListener('DOMContentLoaded', () => {
  if (inIframe()) {
    const aboutLi = document.getElementById('aboutLi') as HTMLElement
    aboutLi.classList.add('hidden')
    const capeTownTopLeft: [number, number] = [-33.444882, 18.027865]
    const capeTownBottomRight: [number, number] = [-34.539817, 20.659773]
    map.fitBounds([capeTownTopLeft, capeTownBottomRight])
  }
  const locationMarkers = new LocationMarkers(map)
  locationMarkers.refresh()
  const menuButtons = Array.from(document.getElementsByClassName('toggle'))
  menuButtons.forEach((button) => {
    (button as HTMLElement).onclick = (event: Event) => {
      event.stopPropagation()
      const menu = document.getElementById('menu') as HTMLElement
      const panelId = (button as HTMLElement).dataset.panel as string
      const panel = document.getElementById(panelId) as HTMLElement
      menu.classList.remove('show')
      panel.classList.add('show')
    }
  })
  document.body.onclick = () => {
    const menu = document.getElementById('menu') as HTMLElement
    menuButtons.forEach((button) => {
      const panelId = (button as HTMLElement).dataset.panel as string
      const panel = document.getElementById(panelId) as HTMLElement
      panel.classList.remove('show')
    })
    menu.classList.add('show')
  }
})

function inIframe(): boolean {
  try {
    return window.self !== window.top
  } catch (error) {
    return true
  }
}
