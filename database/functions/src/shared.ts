import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp(functions.config().firebase)
export const db = admin.firestore()

export const sendError = (response: functions.Response, code: number, type: string, details?: {[key: string]: any}) => {
  response.status(code).send({
    "type": `error/${type}`,
    ...details
  })
}
