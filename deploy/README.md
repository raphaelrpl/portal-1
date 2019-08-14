# Web Portal - Deploy

## Installation
### Requirements

Make sure you have the following libraries installed:

- [`Node.js >= 8.x`](https://nodejs.org/en/)
- [`Angular CLI >= 7`](https://angular.io/)

```
npm install
```

## Runnig

* firstly, configure the files in the `src/environments` folder.

```
cd ../bdc-portal && npm run build
cd ../deploy
docker build -t brazildatacube/portal:0.0.1
```