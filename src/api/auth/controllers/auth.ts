/**
 * auth controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('plugin::users-permissions.user', ({ strapi }) => ({
  async login(ctx) {
    try {
      const { identifier, password } = ctx.request.body;

      if (!identifier || !password) {
        return ctx.badRequest('Identifier and password are required');
      }

      // Use Strapi's auth service
      const response = await strapi
        .plugin('users-permissions')
        .service('auth')
        .authenticate({ identifier, password }, 'local');

      return ctx.send(response);
    } catch (err: any) {
      return ctx.badRequest('Authentication failed', { error: err.message });
    }
  },

  async register(ctx) {
    try {
      const { username, email, password, ...otherData } = ctx.request.body;

      if (!username || !email || !password) {
        return ctx.badRequest('Username, email, and password are required');
      }

      // Use Strapi's auth service
      const response = await strapi
        .plugin('users-permissions')
        .service('auth')
        .register({
          username,
          email,
          password,
          ...otherData
        });

      return ctx.send(response);
    } catch (err: any) {
      return ctx.badRequest('Registration failed', { error: err.message });
    }
  }
}));
