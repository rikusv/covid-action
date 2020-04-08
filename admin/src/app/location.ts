import * as firebase from 'firebase/app'

export type Collection = 'locations' | 'pending-locations'

export class Location {
  id: string
  address: string
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
  changedAt: firebase.firestore.FieldValue
  changedBy: string
  submittedBy: string
  publishedBy: string
  touchedBy: {[uid: string]: true} = {}

  constructor(id: string) {
    this.id = id
  }
}

export interface Coordinates {
  latitude: number
  longitude: number
}
