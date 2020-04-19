// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  HOST: 'http://[IP_SERVER_BACKEND]:[PORT_SERVER_BACKEND]',
  TOKEN_AUTH_USERNAME: '[TU_CLIENT_ID]',
  TOKEN_AUTH_PASSWORD: '[TU_CLIENT_SECRET]',
  TOKEN_NAME: 'access_token',
  REINTENTOS: 3
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
