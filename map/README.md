# covid-action map

[covid-action map](https://covid-action-map.web.app) is a Leaflet.js map to make community action and support information useful to those who can help, and those who need help.

## Development

To minimise the map website download size, only plain HTML, CSS, JavaScript (via TypeScript), plus Leaflet.js are used.

Develop in TypeScript in [src/](./src/), then build and serve:

```bash
npm install -g webpack webpack-cli firebase-tools # First time on machine
npm install # First time after cloning
npm run serve
```

> TODO: use webpack dev serve auto reload.
> TODO: implement auto cache busting, e.g. with https://github.com/jantimon/html-webpack-plugin/blob/master/docs/template-option.md. As workaround manually increment `main-n.js` in index.html and webpack.config.js output.

## Deployment

> **There is no separate staging and production environments for now.**

A Firestore hosting target must be deployed, and details maintained in [.firebaserc](./.firebaserc).

Build and deploy:

```bash
npm install -g firebase-tools # First time
firebase login
npm run deploy
```

## Contributing

TODO.

## License

TODO.
