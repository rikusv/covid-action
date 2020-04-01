export interface ILocationData {
  category: string
  coordinates: [number, number]
  description: string
  email: string
  name: string
  tags: string[]
  telephone: string
  webUrl: string
  whatsAppUrl: string
}

class LocationData {
  private path = 'https://firestore.googleapis.com/v1/projects/covid-action/databases/(default)/documents/locations?pageSize=9999'
  private locations: ILocationData[] = []
  public async getData(refresh?: boolean): Promise<ILocationData[]> {
    if (!refresh && this.locations.length) {
      return this.locations
    }
    const request = new XMLHttpRequest()
    request.responseType = 'json'
    request.open('GET', this.path, true)
    const response: ILocationData[] = await new Promise((resolve) => {
      request.addEventListener('load', () => {
        this.locations = request.response.documents
        .map((doc: any) => doc.fields)
        .map((fields: any) => ({
          category: fields.category.stringValue,
          coordinates: [fields.coordinates.geoPointValue.latitude, fields.coordinates.geoPointValue.longitude],
          description: fields.description.stringValue,
          email: fields.email ? fields.email.stringValue : '',
          name: fields.name.stringValue,
          tags: fields.tags && fields.tags.arrayValue.values ?
          fields.tags.arrayValue.values.map((value: any) => value.stringValue) :
          [],
          telephone: fields.telephone ? fields.telephone.stringValue : '',
          webUrl: fields.webUrl ? fields.webUrl.stringValue : '',
          whatsAppUrl: fields.whatsAppUrl ? fields.whatsAppUrl.stringValue : '',
        }))
        resolve(this.locations)
      })
      request.send()
    })
    return response
  }
}

export const locationData = new LocationData()
