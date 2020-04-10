import * as functions from 'firebase-functions'
import { db } from './shared'

export const onAuthUserCreate = functions.region('europe-west1').auth.user().onCreate(authUser => {
  const uid = authUser.uid
  const user = {
    email: authUser.email,
    name: authUser.displayName,
    phone: authUser.phoneNumber
  }
  return db.collection('users').doc(uid).set(user, { merge: true })
  .then(() => console.log(`User ${uid} written.`))
  .catch(error => console.error(`Could not write user ${uid}`, error))
})
