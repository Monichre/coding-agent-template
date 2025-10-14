// Sentry initialization and error tracking
// Install with: npm install @sentry/nextjs

// Uncomment the following code after installing @sentry/nextjs:

/*
import * as Sentry from "@sentry/nextjs";

export function initSentry() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      
      // Adjust the sample rate for performance monitoring
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      
      // Capture errors
      beforeSend(event, hint) {
        // Filter out sensitive information
        if (event.request?.cookies) {
          delete event.request.cookies;
        }
        if (event.request?.headers) {
          delete event.request.headers['authorization'];
          delete event.request.headers['cookie'];
        }
        return event;
      },
      
      integrations: [
        new Sentry.BrowserTracing(),
        new Sentry.Replay({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      
      // Session replay sample rate
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });
  }
}

export function captureException(error: Error, context?: Record<string, any>) {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureException(error, {
      extra: context,
    });
  } else {
    console.error('Error:', error, context);
  }
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: Record<string, any>) {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureMessage(message, {
      level,
      extra: context,
    });
  } else {
    console.log(`[${level}] ${message}`, context);
  }
}

export function setUserContext(userId: string, email?: string) {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.setUser({
      id: userId,
      email,
    });
  }
}

export function addBreadcrumb(message: string, category: string, data?: Record<string, any>) {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.addBreadcrumb({
      message,
      category,
      data,
      level: 'info',
    });
  }
}
*/

// Placeholder functions when Sentry is not installed
export function initSentry() {
  console.log('Sentry not initialized. Install @sentry/nextjs to enable error tracking.')
}

export function captureException(error: Error, context?: Record<string, any>) {
  console.error('Error:', error, context)
}

export function captureMessage(
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
  context?: Record<string, any>,
) {
  console.log(`[${level}] ${message}`, context)
}

export function setUserContext(userId: string, email?: string) {
  // No-op placeholder
}

export function addBreadcrumb(message: string, category: string, data?: Record<string, any>) {
  // No-op placeholder
}
