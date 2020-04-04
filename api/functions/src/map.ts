import { Client, PlaceAutocompleteRequest, PlaceAutocompleteResponse } from "@googlemaps/google-maps-services-js"
import * as functions from 'firebase-functions'

import { sendError } from './utils'

const client = new Client()

console.log('key')
console.log(functions.config().googlemaps.apikey)

export const placeAutocomplete = functions.region('europe-west1').https.onRequest(async (request, response) => {
  // TODO: restrict origins
  response.set('Access-Control-Allow-Origin', '*')
  if (request.method === 'OPTIONS') {
    response.set('Access-Control-Allow-Methods', 'GET')
    response.set('Access-Control-Allow-Headers', ['Content-Type', 'Authorization'])
    response.set('Access-Control-Max-Age', '3600')
    response.status(204).send('')
  } else if (request.method !== 'GET') {
    sendError(response, 405, 'unsupported-method')
  } else {
    const input: string = request.query.input
    if (!input) {
      sendError(response, 400, 'missing-query-parameter')
    } else {
      try {
        const autoCompleteRequest: PlaceAutocompleteRequest = {
          params: {
            components: ['country:za'],
            input,
            key: functions.config().googlemaps.apikey
          }
        }
        const rawResponse: PlaceAutocompleteResponse = await client.placeAutocomplete(autoCompleteRequest)
        if (rawResponse.status === 200 && !rawResponse.data.error_message) {
          const results = rawResponse.data.predictions.map(rawResult => ({
            address: rawResult.description,
            placeId: rawResult.place_id
          }))
          response.status(200).send(results)
        } else {
          sendError(response, 500, 'google-maps-places-autocomplete', {
            error: JSON.stringify(rawResponse.data.error_message)
          })
        }
      } catch (error) {
        sendError(response, 500, 'unknown', {
          error: JSON.stringify(error)
        })
      }
    }
  }
})
