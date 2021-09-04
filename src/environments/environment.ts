// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiEndpoint: 'http://localhost:5091/api/v1/',
  authConfig: {
    client_id: 'homeorganizer',
    scope: "openid profile email ho.read",
    response_type: "id_token token",
    authority: 'http://localhost:5000',
    authorityApi: 'http://localhost:5000/api',
    redirect_uri: 'http://localhost:5090/auth-callback',
    post_logout_redirect_uri: 'http://localhost:5090/',
    silent_redirect_uri: 'http://localhost:5090/assets/silent-refresh.html',
    redirect_component_signin: '/shopping',
    redirect_component_signout: '/home',
    redirect_component_register: '/register'
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
