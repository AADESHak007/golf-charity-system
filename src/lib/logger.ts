const isDev = process.env.NODE_ENV === 'development';
const isDebugEnabled = process.env.NEXT_PUBLIC_DEBUG === 'true';
const shouldLog = isDev && isDebugEnabled;

export const logger = {
  info: (...args: any[]) => {
    if (shouldLog) {
      console.log('[INFO]', ...args);
    }
  },
  error: (...args: any[]) => {
    // We always want to see errors in Dev, but respect isDev
    if (isDev) {
      console.error('[ERROR]', ...args);
    }
  },
  warn: (...args: any[]) => {
    if (shouldLog) {
      console.warn('[WARN]', ...args);
    }
  },
  debug: (...args: any[]) => {
    if (shouldLog) {
      console.debug('[DEBUG]', ...args);
    }
  },
};
