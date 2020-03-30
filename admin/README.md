# covid-action admin

[covid-action admin](https://covid-action-admin.web.app) is an Angular app to manage locations on the [covid-action map](../map/).

## Development

[Angular CLI](https://github.com/angular/angular-cli) is used for this project. See 'Annexure: Angular CLI' below.

Run `npm install` after cloning.

## Deployment

> **There is no separate staging and production environments for now.**

A Firestore [database](../database/), and a Firestore hosting target, must be deployed, and details maintained in the relevant [environment](./src/environments/) file, and in [.firebaserc](./.firebaserc).

This Angular app is deployed to Firebase Hosting:

```bash
npm install -g firebase-tools # First time
firebase login
npm run deploy
```

## Contributing

TODO.

## License

TODO.

# Annexure: Angular CLI (generated)


This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
