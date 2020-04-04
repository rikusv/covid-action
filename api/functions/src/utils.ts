import * as functions from 'firebase-functions'

export const sendError = (response: functions.Response, code: number, type: string, details?: {[key: string]: any}) => {
  response.status(code).send({
    "type": `error/${type}`,
    ...details
  })
}
