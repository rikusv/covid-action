# covid-action API

The covid-action API provides endpoints to interact with the data programmatical via HTTP endpoints. For example, an external system can write data to the covid-action map.

At the moment, this consists only of the [functions](./functions). See README.md for development information.

## Usage

The API can be used to create and update locations, and also provides some services to the admin app.

### Batch write locations

> You need to have a covid-action API key to write data.

To get the JSON Schema describing what the array of locations should look like, send a `GET` request to https://europe-west1-covid-action.cloudfunctions.net/locations?schema:

```curl
curl --location --request GET 'https://europe-west1-covid-action.cloudfunctions.net/locations?schema=true'
```

To write a batch of locations, send a `PATCH` request to https://europe-west1-covid-action.cloudfunctions.net/locations with your API key in the `Authorization` header, and a JSON array of locations in the body. **Location fields without values should not be included in the payload, unless the intention if explicitly to delete those fields (they may have manually maintained values).**

> The 'primary key' of the data is `category` + `coordinates` - that is, these 2 fields determine whether new records are create, or existing records updated.

```curl
curl --location --request PATCH 'https://europe-west1-covid-action.cloudfunctions.net/locations' \
--header 'Authorization: <API key>' \
--header 'Content-Type: application/json' \
--data-raw '[
  {
  "category": "W-CAN",
  "coordinates": {
    "latitude": -34,
    "longitude": 18
  },
  "description": "Some description",
  "email": "someone@some.com",
  "name": "Some name",
  "tags": ["tag1", "tag2"],
  "telephone": "+279999999999",
  "webUrl": "https://some.site.com",
  "whatsAppUrl": "https://some.whatsapp.link"
  }
]'
```

The response will hopefully look something like this:

```json
{
    "type": "success/processed",
    "locationCounts": {
        "sent": 1,
        "errors": 0,
        "saved": 1
    }
}
```

### Admin app services

Autocomplete address:

```bash
  curl --location --request GET 'https://europe-west1-covid-action.cloudfunctions.net/placeAutocomplete?input=8%20arch'
```

## Administration

API keys are created somewhat manually at the moment.

> TODO: include API key generation in admin app.

The following Node.js script can be used to generate an API key and corresponding hash. The API key is given to the client, and only the hash is kept by covid-action.

```javascript
const { uuid } = require('uuidv4')
crypto = require('crypto')
const apiKey = uuid()
const hash = crypto.createHash('sha256').update(apiKey).digest('hex')
console.log(apiKey)
console.log(hash)
```

Then create a document in the `clients` collection in Firestore, with the above hash as `id`, and identifying information:

```json
{
  "name": "Some organization",
  "contacts": [
    {
      "name": "Some Name",
      "email": "someone@some.com"
    }
  ]
}
```

## Contributing

TODO.

## License

TODO.
