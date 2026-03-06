import { z } from 'zod';
import { vitals, insertVitalsSchema } from './schema';

export const api = {
  vitals: {
    method: 'GET' as const,
    path: '/api/vitals' as const,
    responses: {
      200: z.array(z.custom<typeof vitals.$inferSelect>()),
    },
  },
  patients: {
    method: 'GET' as const,
    path: '/api/patients' as const,
    responses: {
      200: z.array(z.string()),
    }
  },
  patientHistory: {
    method: 'GET' as const,
    path: '/api/patients/:id/vitals' as const,
    responses: {
      200: z.array(z.custom<typeof vitals.$inferSelect>()),
    }
  },
  anomalies: {
    method: 'GET' as const,
    path: '/api/anomalies' as const,
    responses: {
      200: z.array(z.custom<typeof vitals.$inferSelect>()),
    }
  }
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
