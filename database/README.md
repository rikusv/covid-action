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
firebase deploy --only firestore:rules
```

## Data backups

A Firebase project must be available, and Cloud Storage must be activated.

For now, there is no automatic backup (it could be done using Cloud Functions - for example, see [Schedule data exports](https://firebase.google.com/docs/firestore/solutions/schedule-export)). To back up all the Firestore data:

```bash
gcloud firestore export gs://covid-action.appspot.com/backups/$(TZ=UTC date '+%Y-%m-%dT%H:%M:%SZ')
```

To restore data from an export:

```bash
gcloud firestore import gs://covid-action.appspot.com/backups/{timestamp}

# Example:
gcloud firestore import gs://covid-action.appspot.com/backups/2020-01-01T00:00:00Z
```

See [Export and import data](https://firebase.google.com/docs/firestore/manage-data/export-import).

## Contributing

TODO.

## License

TODO.

npm install -g firebase-tools
