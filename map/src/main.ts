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
  const locationMarkers = new LocationMarkers(map)
  locationMarkers.refresh()
  const filterButton = document.getElementById('filterButton') as HTMLElement
  filterButton.onclick = (event: Event) => {
    event.stopPropagation()
    const menu = document.getElementById('menu') as HTMLElement
    const filterPanel = document.getElementById('filterPanel') as HTMLElement
    menu.classList.remove('show')
    filterPanel.classList.add('show')
  }
  document.body.onclick = () => {
    const menu = document.getElementById('menu') as HTMLElement
    const filterPanel = document.getElementById('filterPanel') as HTMLElement
    menu.classList.add('show')
    filterPanel.classList.remove('show')
  }
})
