/**
 * mettings-list router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::mettings-list.mettings-list', {
  config: {
    find: {
      middlewares: [],
    },
    findOne: {
      middlewares: [],
    },
    create: {
      middlewares: [],
    },
  },
  // @ts-ignore - routes property is supported but not in TypeScript definitions
  routes: [
    {
      method: 'POST',
      path: '/bookings',
      handler: 'mettings-list.createBooking',
      config: {
        auth: true,
      },
    },
  ],
});
