# covid-action Cloud Functions

The covid-action Cloud Functions implement HTTP endpoints to interact with the data programmatically, and triggers for processing in the database.

## Development

Develop in TypeScript in [src/](./src/), then build and serve:

> Download your App Engine default service account key in JSON format, from the Google Cloud Console [Service Accounts pane](https://console.cloud.google.com/iam-admin/serviceaccounts). See [Run functions locally](https://firebase.google.com/docs/functions/local-emulator) for details. Remember to store the key securely!

> Get a Google Cloud Platform project API key from Google Cloud Console -> [API Credentials](https://console.cloud.google.com/apis/credentials).

```bash
npm install -g firebase-tools # First time on machine
npm install # First time after cloning
firebase login # When necessary
firebase functions:config:set googlemaps.apikey="GOOGLE_MAPS_API_KEY value" # Only once or when changing between keys
export GOOGLE_APPLICATION_CREDENTIALS="path/to/key.json" # Once
npm run serve
```

## Deployment

> **There is no separate staging and production environments for now.**

```bash
npm install -g firebase-tools # First time on machine
firebase login # When necessary
firebase functions:config:set googlemaps.apikey="GOOGLE_MAPS_API_KEY value" # Only once or when changing between keys
npm run deploy
```
