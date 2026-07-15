import { environment } from 'src/environments/environment';

export const logger = {
  /**
   * Log information when not in production
   * @param label - Label for the information
   * @param data - Data to log
   */
  log(labelOrData: string | unknown, data?: unknown): void {
    if (environment.envName != 'prod') {
      if (typeof labelOrData === 'string' && data !== undefined) {
        console.log(`🔥 [${labelOrData}]`, data);
      } else {
        console.log('🔥', labelOrData);
      }
    }
  },

  /**
   * Log error when not in production
   * @param label - Label for the error
   * @param error - Error to log
   */
  error(label: string, error: unknown): void {
    if (environment.envName != 'prod') {
      console.error(`❌ [${label}]`, error);
    }
  },

  /**
   * Log warning when not in production
   * @param label - Label for the warning
   * @param data - Data to log
   */
  warn(label: string, data: unknown): void {
    if (environment.envName != 'prod') {
      console.warn(`⚠️ [${label}]`, data);
    }
  },
};
