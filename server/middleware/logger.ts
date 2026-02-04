import { Request, Response, NextFunction } from 'express';

export interface LogData {
  timestamp: string;
  method: string;
  url: string;
  statusCode: number;
  duration: number;
  ip: string;
  userAgent?: string;
  userId?: string;
  error?: string;
}

class Logger {
  private logs: LogData[] = [];
  private maxLogs = 1000; // Keep last 1000 logs in memory

  private formatLog(data: LogData): string {
    const { timestamp, method, url, statusCode, duration, ip, error } = data;
    const statusColor = statusCode >= 400 ? '\x1b[31m' : statusCode >= 300 ? '\x1b[33m' : '\x1b[32m';
    const reset = '\x1b[0m';
    
    let log = `${timestamp} ${method} ${url} ${statusColor}${statusCode}${reset} ${duration}ms ${ip}`;
    
    if (error) {
      log += ` ${statusColor}ERROR: ${error}${reset}`;
    }
    
    return log;
  }

  private createLogData(req: Request, res: Response, duration: number): LogData {
    return {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      ip: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent'),
      userId: (req as any).user?.id, // If user is attached to request
    };
  }

  public logRequest(req: Request, res: Response, duration: number, error?: string): void {
    const logData = this.createLogData(req, res, duration);
    if (error) {
      logData.error = error;
    }

    // Add to memory logs
    this.logs.push(logData);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift(); // Remove oldest log
    }

    // Format and output
    const formattedLog = this.formatLog(logData);
    console.log(formattedLog);
  }

  public logError(message: string, error?: any, context?: any): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: 'ERROR',
      message,
      error: error?.message || error,
      context,
    };

    console.error(`\x1b[31m${timestamp} ERROR: ${message}\x1b[0m`);
    if (error?.stack) {
      console.error(error.stack);
    }
    if (context) {
      console.error('Context:', context);
    }
  }

  public logInfo(message: string, context?: any): void {
    const timestamp = new Date().toISOString();
    console.log(`\x1b[36m${timestamp} INFO: ${message}\x1b[0m`);
    if (context) {
      console.log('Context:', context);
    }
  }

  public logWarning(message: string, context?: any): void {
    const timestamp = new Date().toISOString();
    console.warn(`\x1b[33m${timestamp} WARNING: ${message}\x1b[0m`);
    if (context) {
      console.warn('Context:', context);
    }
  }

  public getRecentLogs(count: number = 100): LogData[] {
    return this.logs.slice(-count);
  }

  public getLogsByTimeRange(startTime: Date, endTime: Date): LogData[] {
    return this.logs.filter(log => {
      const logTime = new Date(log.timestamp);
      return logTime >= startTime && logTime <= endTime;
    });
  }

  public getErrorLogs(count: number = 50): LogData[] {
    return this.logs
      .filter(log => log.error || log.statusCode >= 400)
      .slice(-count);
  }

  public clearLogs(): void {
    this.logs = [];
    this.logInfo('Logs cleared');
  }

  public getStats() {
    const totalLogs = this.logs.length;
    const errorLogs = this.logs.filter(log => log.statusCode >= 400 || log.error).length;
    const avgResponseTime = this.logs.reduce((sum, log) => sum + log.duration, 0) / totalLogs || 0;
    
    return {
      totalLogs,
      errorLogs,
      errorRate: totalLogs > 0 ? (errorLogs / totalLogs * 100).toFixed(2) + '%' : '0%',
      avgResponseTime: avgResponseTime.toFixed(2) + 'ms',
      uptime: process.uptime() + 's',
      memoryUsage: process.memoryUsage()
    };
  }
}

export const logger = new Logger();

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.logRequest(req, res, duration);
  });

  next();
};
