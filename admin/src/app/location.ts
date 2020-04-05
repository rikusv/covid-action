export class Location {
  id: string
  address: string
  area: string
  category: string
  coordinates: Coordinates
  description: string
  email: string
  googlePlaceId: string
  name: string
  tags: string[] = []
  telephone: string
  webUrl: string
  whatsAppUrl: string

  constructor(id: string) {
    this.id = id
  }
}

export interface Coordinates {
  latitude: number
  longitude: number
}
