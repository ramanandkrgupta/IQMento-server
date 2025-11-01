/**
 * college router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::college.college', {
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
      path: '/colleges/featured',
      handler: 'college.featured',
      config: {
        auth: false,
      },
    },
  ],
});
