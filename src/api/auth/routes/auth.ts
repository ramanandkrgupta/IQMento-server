/**
 * auth router
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/login',
      handler: 'auth.login',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/register',
      handler: 'auth.register',
      config: {
        auth: false,
      },
    },
  ],
};
