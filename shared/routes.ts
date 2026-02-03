import { z } from 'zod';
import { insertKudoSchema, kudos, users } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  kudos: {
    list: {
      method: 'GET' as const,
      path: '/api/kudos',
      responses: {
        200: z.array(z.custom<any>()), // Returns KudoWithUser[]
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/kudos',
      input: insertKudoSchema,
      responses: {
        201: z.custom<typeof kudos.$inferSelect>(),
        400: errorSchemas.validation,
        401: z.object({ message: z.string() }),
      },
    },
  },
  users: {
    list: {
      method: 'GET' as const,
      path: '/api/users',
      responses: {
        200: z.array(z.custom<typeof users.$inferSelect>()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
