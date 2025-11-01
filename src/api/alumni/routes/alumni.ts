/**
 * alumni router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::alumni.alumni', {
  config: {
    find: {
      middlewares: [],
    },
    findOne: {
      middlewares: [],
    },
  },
  // @ts-ignore - routes property is supported but not in TypeScript definitions
  routes: [
    {
      method: 'GET',
      path: '/alumni/bookable',
      handler: 'alumni.bookable',
      config: {
        auth: false,
      },
    },
  ],
});
