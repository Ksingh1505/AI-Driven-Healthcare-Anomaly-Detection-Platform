import { z } from 'zod';
import { vitals, alerts } from './schema';

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
  },
  updateStatus: {
    method: 'PATCH' as const,
    path: '/api/patients/:id/status' as const,
    input: z.object({ status: z.string(), notes: z.string().optional() }),
    responses: {
      200: z.custom<typeof vitals.$inferSelect>(),
    }
  },
  alerts: {
    list: {
      method: 'GET' as const,
      path: '/api/alerts' as const,
      responses: {
        200: z.array(z.custom<typeof alerts.$inferSelect>()),
      }
    },
    markRead: {
      method: 'POST' as const,
      path: '/api/alerts/:id/read' as const,
      responses: {
        200: z.object({ success: z.boolean() }),
      }
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
