# covid-action API functions

The covid-action API functions implement endpoints to interact with the data programmatically via HTTP endpoints.

## Development

Develop in TypeScript in [src/](./src/), then build and serve:

> Download your App Engine default service account key in JSON format, from the Google Cloud Console [Service Accounts pane](https://console.cloud.google.com/iam-admin/serviceaccounts). See [Run functions locally](https://firebase.google.com/docs/functions/local-emulator) for details. Remember to store the key securely!

```bash
npm install -g firebase-tools # First time on machine
npm install # First time after cloning
export GOOGLE_APPLICATION_CREDENTIALS="path/to/key.json" # once
npm run serve
```

## Deployment

> **There is no separate staging and production environments for now.**

```bash
npm install -g firebase-tools # First time on machine
firebase login
npm run deploy
```
