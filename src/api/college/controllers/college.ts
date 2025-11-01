/**
 * college controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::college.college', ({ strapi }) => ({
  async featured(ctx) {
    try {
      const { data, meta } = await strapi
        .service('api::college.college')
        .find({
          filters: {
            isFeatured: true,
            publishedAt: { $notNull: true }
          },
          populate: {
            coverImage: true,
            collegePhotos: true,
            alumnis: {
              populate: {
                userId: {
                  populate: {
                    profilePic: true
                  }
                }
              }
            }
          },
          sort: { createdAt: 'desc' }
        });

      return ctx.send({ data, meta });
    } catch (err) {
      return ctx.badRequest('Error fetching featured colleges', { error: err.message });
    }
  },

  async find(ctx) {
    const { query } = ctx;
    const { page = 1, limit = 10, search } = query;

    try {
      const filters: any = {
        publishedAt: { $notNull: true }
      };

      // Add search filter if provided
      if (search) {
        filters.$or = [
          { name: { $containsi: search } },
          { descriptions: { $containsi: search } },
          { location: { $containsi: search } }
        ];
      }

      const { data, meta } = await strapi
        .service('api::college.college')
        .find({
          filters,
          populate: {
            coverImage: true,
            alumnis: {
              populate: {
                userId: {
                  populate: {
                    profilePic: true
                  }
                }
              }
            }
          },
          pagination: {
            page: parseInt(page as string),
            pageSize: parseInt(limit as string)
          },
          sort: { createdAt: 'desc' }
        });

      return ctx.send({ data, meta });
    } catch (err) {
      return ctx.badRequest('Error fetching colleges', { error: err.message });
    }
  },

  async findOne(ctx) {
    const { id } = ctx.params;

    try {
      const entity = await strapi
        .service('api::college.college')
        .findOne(id, {
          populate: {
            coverImage: true,
            collegePhotos: true,
            alumnis: {
              populate: {
                userId: {
                  populate: {
                    profilePic: true
                  }
                },
                availabilities: true
              }
            }
          }
        });

      if (!entity) {
        return ctx.notFound('College not found');
      }

      // Calculate stats
      const alumniCount = entity.alumnis?.length || 0;
      const bookableAlumniCount = entity.alumnis?.filter((alumni: any) => 
        alumni.isBookable || alumni.accept_meets
      ).length || 0;

      const data = {
        ...entity,
        stats: {
          totalAlumni: alumniCount,
          bookableAlumni: bookableAlumniCount
        }
      };

      return ctx.send({ data });
    } catch (err) {
      return ctx.badRequest('Error fetching college', { error: err.message });
    }
  }
}));
