export class Location {

  id: string
  category: string
  coordinates: {
    latitude?: number
    longitude?: number
  } = {}
  description: string
  email: string
  name: string
  tags: string[] = []
  telephone: string
  webUrl: string
  whatsAppUrl: string

  constructor(id: string) {
    this.id = id
  }
}
