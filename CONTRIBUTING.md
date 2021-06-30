# Contributing

## Code contributions

The following steps will teach you how to setup TypeTest for local development.

**Please note**: You must have nodejs properly installed to setup TypeTest for local development.

### Install dependencies

Once you have cloned this repo, please cd into it and run:

```sh
npm install
```

### Run the local development server

The local development server supports live reloading and hot module replacement! To run it, execute the following command:

```sh
npm run serve
```

### Build production files

To build files for production, execute the following command:

```sh
npm run build
```

Production files will be exported to the `dist` folder. To locally serve the production build, execute the following command:

```sh
npm run serve-build
```