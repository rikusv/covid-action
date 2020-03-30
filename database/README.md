# covid-action database

The covid-action database if a Cloud Firestore database to store locations for the [covid-action map](../map/).

## Development

Maintain security and data validation rules in [firestore.rules](./firestore.rules).

## Deployment

> **There is no separate staging and production environments for now.**

A Firebase project must be available, and its name maintained in [./.firebaserc](./.firebaserc).

Changes is deployed using:

```bash
npm install -g firebase-tools # First time
firebase login
firebase deploy
```

## Contributing

TODO.

## License

TODO.

npm install -g firebase-tools
