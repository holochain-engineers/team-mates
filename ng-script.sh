##ng-hc-holochain install script version 12.2.8

git clone this starter project

## make sure you are using the ACTIVE LTS node (currently node 14.18)
## make sure you are using the latest npm (7.x) to avoid install errors
## if you are using nvm and want the latest non packaged npm version: 
## cd ~/.nvm/versions/node/v14.18.0/lib
## npm install npm 


## choose global cli or npx
## NPX 
npx -p @angular/cli@latest ng new invitations --skip-tests --minimal --routing --style=scss
## or 

## install anglular cli
npm install -g @angular/cli

## new minimal project
## add angular routing (yes)
## choose SCSS option for styling
## if you want testing and linting remove the skip switches
ng new ng-hc-starter --skip-tests --minimal --style=scss


rename the directory from invitations to ui and cd ui

## install ngrx
ng add @ngrx/component-store@latest
## or
npx -p @angular/cli@latest ng add @ngrx/component-store@latest

## HOLOCHAIN INSTRUCTIONS
## ----------------------

## install the holochain cell client
npm install --save-exact @holochain/conductor-api
npm install @holochain-open-dev/cell-client


## Optional styling with tailwind

## cd ng-hc-starter and add tailwind
npm install -D tailwindcss

## add tailwind config file
touch tailwind.config.js

## paste following code
 module.exports = {
  // mode: 'jit',
  purge: ['./src/**/*.{html,ts}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};


# add styles to /src/styles.scss:
 
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';




## install supporting dependencies  "mobx-angular": "^4.3.0", (waiting update to avoid legacy install)
npm install --save js-base64
npm install --save mobx-angular mobx --legacy-peer-deps

## mock config add "mock":"ng serve --configuration mock"
"mock": {
              "buildOptimizer": false,
              "optimization": false,
              "vendorChunk": true,
              "extractLicenses": false,
              "sourceMap": true,
              "namedChunks": true,
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.mock.ts"
                }
              ]
            }
            
"mock": {
              "browserTarget": "ng-hc-starter:build:mock"
            }
            
            
## set tsconfig environment path in tsconfig.json
"paths": {
      "@environment": ["./src/environments/environment.ts"]
    },

## set allowsyntheticImports to true in tsconfig.json
 "allowSyntheticDefaultImports": true,
    
## in index.html : body class="bg-gray-900"

## buffer hack... temporary.... in polyfill.ts: 
 
 (window as any).global = window;
 global.Buffer = global.Buffer || require('buffer').Buffer;
 
 ## add buffer package
 npm install buffer --save-dev

 ## copy examples from environments, assets and app directories (or create you own content)
 
 
  






