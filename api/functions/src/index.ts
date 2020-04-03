// TODO: Refactor the below to be less ugly.

import { DocumentData, DocumentSnapshot, GeoPoint } from '@google-cloud/firestore'
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as crypto from "crypto"

import Ajv from 'ajv'
import locationsSchema from './schema/locations.json'

admin.initializeApp(functions.config().firebase)

const db = admin.firestore()

const locationCollection = db.collection('locations')
const logCollection = db.collection('logs')

const ajv = new Ajv()
const validateLocations = ajv.compile(locationsSchema)

export const locations = functions.region('europe-west1').https.onRequest(async (request, response) => {
  switch (request.method) {
    case 'GET':
      if (request.query.hasOwnProperty('schema')) {
        response.status(200).send(locationsSchema)
      } else {
        sendError(response, 405, 'not-implemented')
      }
      break
    case 'PATCH':
      const apiKey = request.headers.authorization
      if (!apiKey) {
        sendError(response, 403, 'not-authorized')
      } else {
        const hash = crypto.createHash('sha256').update(apiKey).digest('hex')
        const client = await db.collection('clients').doc(hash).get()
        if (!client.exists) {
          sendError(response, 403, 'not-authorized')
        } else {
          const patchedLocations: any[] = request.body
          const valid = validateLocations(patchedLocations)
          if (!valid) {
            sendError(response, 400, 'validation-failed', {
              "validaton-errors": validateLocations.errors
            })
          } else {
            patchLocations(response, patchedLocations, client)
          }
        }
      }
      break
    default:
      sendError(response, 405, 'unsupported-method')
  }
})

const patchLocations = (
  response: functions.Response,
  patchedLocations: any[],
  client: DocumentSnapshot<DocumentData>
) => {
  const resultsPromises = patchedLocations.map(async patchedLocation => {
    patchedLocation.coordinates = new GeoPoint(patchedLocation.coordinates.latitude, patchedLocation.coordinates.longitude)
    const existing = locationCollection
    .where('category', '==', patchedLocation.category)
    .where('coordinates', '==', patchedLocation.coordinates)
    return existing.get()
    .then(async snapshot => {
      if (snapshot.empty) {
        return locationCollection.add(patchedLocation)
        .then(async () => {
          await writeLog('info', 'New data written.', patchedLocation, client)
          return 0
        })
        .catch(async error => {
          await writeLog('error', 'New data failed to write.', {
            error: JSON.stringify(error),
            data: patchedLocation
          }, client)
          return 1
        })
      } else if (snapshot.size === 1) {
        const existingSnapshot = snapshot.docs[0]
        const existingLocation = existingSnapshot.data()
        const same = Object.keys(patchedLocation).reduce((result, field) => {
          return JSON.stringify(patchedLocation[field]) === JSON.stringify(existingLocation[field]) && result
        }, true)
        if (same) {
          await writeLog('info', 'New data same as current. No update.', {
            new: patchedLocation,
            old: existingLocation
          }, client)
          return 0
        } else {
          return existingSnapshot.ref.update(patchedLocation)
          .then(async () => {
            await writeLog('info', 'Existing data updated.', {
              new: patchedLocation,
              old: existingLocation
            }, client)
            return 0
          })
          .catch(async error => {
            await writeLog('error', 'Failed to update existing data.', {
              error: JSON.stringify(error),
              data: patchedLocation
            }, client)
            return 1
          })
        }
      } else {
        await writeLog('error', 'Existing duplicates found in database. New data not written.', {
          duplicates: snapshot.docs,
          new: patchedLocation
        }, client)
        return 1
      }
    })
    .catch(async error => {
      await writeLog('error', 'Unexpected error.', {
        error: JSON.stringify(error),
        data: patchedLocation
      }, client)
      return 1
    })
  })
  Promise.all(resultsPromises)
  .then(results => {
    const errorCount = results.reduce((previous, current) => previous + current, 0)
    response.status(200).send({
      type: "success/processed",
      locationCounts: {
        sent: patchedLocations.length,
        errors: errorCount,
        saved: patchedLocations.length - errorCount
      }
    })
  })
  .catch(error => {
    sendError(response, 500, 'unknown', {error: JSON.stringify(error)})
  })
}

const sendError = (response: functions.Response, code: number, type: string, details?: {[key: string]: any}) => {
  response.status(code).send({
    "type": `error/${type}`,
    ...details
  })
}

const writeLog = async (
  severity: 'info' | 'warning' | 'error',
  description: string, detail: any,
  client: DocumentSnapshot<DocumentData>
): Promise<null | any> => {
  return logCollection.add({
    clientId: client.id,
    description,
    detail,
    severity,
    source: 'api-functions',
    timestamp: new Date().toISOString()
  }).then(() => null).catch(error => {
    console.error('Could not write to log', error)
    return 1
  })
}
