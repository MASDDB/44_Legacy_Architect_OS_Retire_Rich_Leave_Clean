/**
 * Centralized Logger Utility
 * Handles application logging with environment awareness and PII redaction.
 */

const IS_PROD = import.meta.env.PROD;
const LOG_LEVEL = import.meta.env.VITE_LOG_LEVEL || (IS_PROD ? 'error' : 'debug');

const LEVELS = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    none: 4,
};

/**
 * Basic redaction for common sensitive keys
 */
const redact = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;

    const sensitiveKeys = ['password', 'token', 'apiKey', 'secret', 'credit_card', 'ssn'];
    const newObj = Array.isArray(obj) ? [...obj] : { ...obj };

    for (const key in newObj) {
        if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk.toLowerCase()))) {
            newObj[key] = '[REDACTED]';
        } else if (typeof newObj[key] === 'object') {
            newObj[key] = redact(newObj[key]);
        }
    }
    return newObj;
};

const shouldLog = (level) => {
    return LEVELS[level] >= LEVELS[LOG_LEVEL];
};

export const logger = {
    debug: (message, ...args) => {
        if (shouldLog('debug')) {
            console.debug(`[DEBUG] ${message}`, ...args.map(redact));
        }
    },

    info: (message, ...args) => {
        if (shouldLog('info')) {
            console.info(`[INFO] ${message}`, ...args.map(redact));
        }
    },

    warn: (message, ...args) => {
        if (shouldLog('warn')) {
            console.warn(`[WARN] ${message}`, ...args.map(redact));
        }
    },

    error: (message, error, ...args) => {
        if (shouldLog('error')) {
            console.error(`[ERROR] ${message}`, error, ...args.map(redact));

            // In production, we could also send this to a service like Sentry
            // if (IS_PROD) {
            //   Sentry.captureException(error, { extra: redact(args) });
            // }
        }
    }
};

export default logger;
