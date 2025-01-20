enum LogLevel {
  INFO = 'INFO',
  ERROR = 'ERROR',
  WARN = 'WARN',
  DEBUG = 'DEBUG'
}

interface LogMessage {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
}

export const logger = {
  info: (message: string, data?: any) => {
    console.log('\x1b[32m%s\x1b[0m', JSON.stringify({
      level: LogLevel.INFO,
      message,
      timestamp: new Date().toISOString(),
      data
    }));
  },

  error: (message: string, error?: any) => {
    console.error('\x1b[31m%s\x1b[0m', JSON.stringify({
      level: LogLevel.ERROR,
      message,
      timestamp: new Date().toISOString(),
      error: error?.message || error
    }));
  },

  warn: (message: string, data?: any) => {
    console.warn('\x1b[33m%s\x1b[0m', JSON.stringify({
      level: LogLevel.WARN,
      message,
      timestamp: new Date().toISOString(),
      data
    }));
  },

  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug('\x1b[36m%s\x1b[0m', JSON.stringify({
        level: LogLevel.DEBUG,
        message,
        timestamp: new Date().toISOString(),
        data
      }));
    }
  }
};
