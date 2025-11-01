/**
 * mettings-list controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::mettings-list.mettings-list', ({ strapi }) => ({
  async createBooking(ctx) {
    try {
      const { body } = ctx.request;
      const { alumniId, meetingTime, durationInMin, callType, meetLink } = body;

      // Get authenticated user
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized('Authentication required');
      }

      // Validate required fields
      if (!alumniId || !meetingTime || !durationInMin || !callType) {
        return ctx.badRequest('Missing required fields: alumniId, meetingTime, durationInMin, callType');
      }

      // Fetch alumni to verify booking is allowed
      const alumni = await strapi.entityService.findOne('api::alumni.alumni', alumniId, {
        populate: ['userId']
      });

      if (!alumni) {
        return ctx.notFound('Alumni not found');
      }

      if (!alumni.isBookable && !alumni.accept_meets) {
        return ctx.badRequest('This alumnus is not accepting bookings');
      }

      // Generate meeting ID
      const meetingId = `MT${Date.now()}${Math.floor(Math.random() * 1000)}`;

      // Create meeting record
      const meeting = await strapi.entityService.create('api::mettings-list.mettings-list', {
        data: {
          meetingId,
          alumni: alumniId,
          userId: user.id,
          meetingTime: new Date(meetingTime),
          durationInMin,
          mettingLink: meetLink || '',
          currentStatus: 'upcoming',
          publishedAt: new Date()
        },
        populate: {
          alumni: {
            populate: {
              userId: {
                populate: {
                  profilePic: true
                }
              }
            }
          },
          userId: {
            populate: {
              profilePic: true
            }
          }
        }
      });

      return ctx.send({
        data: meeting,
        message: 'Booking created successfully'
      });
    } catch (err) {
      return ctx.badRequest('Error creating booking', { error: err.message });
    }
  }
}));
