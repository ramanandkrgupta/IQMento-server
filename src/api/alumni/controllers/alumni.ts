/**
 * alumni controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::alumni.alumni', ({ strapi }) => ({
  async bookable(ctx) {
    try {
      const { data, meta } = await strapi
        .service('api::alumni.alumni')
        .find({
          filters: {
            $or: [
              { isBookable: true },
              { accept_meets: true }
            ],
            publishedAt: { $notNull: true }
          },
          populate: {
            userId: {
              populate: {
                profilePic: true
              }
            },
            college: true,
            availabilities: true
          }
        });

      return ctx.send({ data, meta });
    } catch (err) {
      return ctx.badRequest('Error fetching bookable alumni', { error: err.message });
    }
  },

  async findOne(ctx) {
    const { id } = ctx.params;

    try {
      const entity = await strapi
        .service('api::alumni.alumni')
        .findOne(id, {
          populate: {
            userId: {
              populate: {
                profilePic: true
              }
            },
            college: {
              populate: {
                coverImage: true
              }
            },
            availabilities: true,
            mettings_lists_of_alumni: {
              populate: {
                userId: true,
                paymentId: true
              }
            }
          }
        });

      if (!entity) {
        return ctx.notFound('Alumni not found');
      }

      // Transform data to match frontend expectations
      const data = {
        id: entity.id,
        ...entity,
        user: entity.userId,
        bookings: entity.mettings_lists_of_alumni || []
      };

      return ctx.send({ data });
    } catch (err) {
      return ctx.badRequest('Error fetching alumni', { error: err.message });
    }
  }
}));
