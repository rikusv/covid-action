import { Client, PlaceAutocompleteRequest, PlaceAutocompleteResponse, PlaceDetailsRequest, PlaceDetailsResponse } from "@googlemaps/google-maps-services-js"
import * as functions from 'firebase-functions'

import { sendError } from './utils'

const client = new Client()

export const placeDetails = functions.region('europe-west1').https.onRequest(async (request, response) => {
  if (relevant(request, response)) {
     const placeId: string = request.query.placeId
     if (!placeId) {
       sendError(response, 400, 'missing-query-parameter')
     } else {
       try {
         const placeDetailsRequest: PlaceDetailsRequest = {
           params: {
             key: functions.config().googlemaps.apikey,
             place_id: placeId
           }
         }
         const rawResponse: PlaceDetailsResponse = await client.placeDetails(placeDetailsRequest)
         if (rawResponse.status === 200 && !rawResponse.data.error_message) {
           const result = {
             latitude: rawResponse.data.result.geometry?.location.lat,
             longitude: rawResponse.data.result.geometry?.location.lng
           }
           response.status(200).send(result)
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

export const placeAutocomplete = functions.region('europe-west1').https.onRequest(async (request, response) => {
  if (relevant(request, response)) {
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

const relevant = (request: functions.https.Request, response: functions.Response): boolean => {
  // TODO: restrict origins
  response.set('Access-Control-Allow-Origin', '*')
  if (request.method === 'OPTIONS') {
    response.set('Access-Control-Allow-Methods', 'GET')
    response.set('Access-Control-Allow-Headers', ['Content-Type', 'Authorization'])
    response.set('Access-Control-Max-Age', '3600')
    response.status(204).send('')
    return false
  } else if (request.method !== 'GET') {
    sendError(response, 405, 'unsupported-method')
    return false
  } else {
    return true
  }
}
