export const environment = {
  production: true,
  apiEndpoint: 'http://webapp.zapto.org:5091/api/v1/',
  authConfig: {
    client_id: 'homeorganizer',
    scope: "openid profile email ho.read",
    response_type: "id_token token",
    authority: 'http://webapp.zapto.org:5000',
    authorityApi: 'http://webapp.zapto.org:5000/api',
    redirect_uri: 'http://webapp.zapto.org:5090/auth-callback',
    post_logout_redirect_uri: 'http://webapp.zapto.org:5090/',
    silent_redirect_uri: 'http://webapp.zapto.org:5090/assets/silent-refresh.html',
    redirect_component_signin: '/shopping',
    redirect_component_signout: '/home'
  },
};
