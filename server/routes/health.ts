import { Router } from 'express';
import { db } from '../db';
import { logger } from '../middleware/logger';
import { catchAsync } from '../middleware/errorHandler';

const router = Router();

// Basic health check
router.get('/health', catchAsync(async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  };

  res.status(200).json(health);
}));

// Detailed health check with database connectivity
router.get('/health/detailed', catchAsync(async (req, res) => {
  const startTime = Date.now();
  
  // Check database connectivity
  let dbStatus = 'disconnected';
  let dbResponseTime = 0;
  
  try {
    const dbStart = Date.now();
    await db.execute('SELECT 1');
    dbResponseTime = Date.now() - dbStart;
    dbStatus = 'connected';
  } catch (error) {
    logger.logError('Database health check failed', error);
  }

  // Get system stats
  const memoryUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  
  const health = {
    status: dbStatus === 'connected' ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      database: {
        status: dbStatus,
        responseTime: `${dbResponseTime}ms`
      },
      memory: {
        used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system
      }
    }
  };

  const statusCode = dbStatus === 'connected' ? 200 : 503;
  res.status(statusCode).json(health);
}));

// Readiness probe (for Kubernetes/container orchestration)
router.get('/ready', catchAsync(async (req, res) => {
  try {
    // Check if database is ready
    await db.execute('SELECT 1');
    
    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.logError('Readiness check failed', error);
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString(),
      error: 'Database not available'
    });
  }
}));

// Liveness probe (for Kubernetes/container orchestration)
router.get('/live', (req, res) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
  });

// Metrics endpoint
router.get('/metrics', catchAsync(async (req, res) => {
  const stats = logger.getStats();
  const memoryUsage = process.memoryUsage();
  
  const metrics = {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      heapUsed: memoryUsage.heapUsed,
      heapTotal: memoryUsage.heapTotal,
      rss: memoryUsage.rss,
      external: memoryUsage.external
    },
    requests: {
      total: stats.totalLogs,
      errors: stats.errorLogs,
      errorRate: stats.errorRate,
      avgResponseTime: stats.avgResponseTime
    },
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch
    }
  };

  res.status(200).json(metrics);
}));

// Recent logs endpoint
router.get('/logs', catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 100;
  const level = req.query.level as string;
  
  let logs;
  if (level === 'error') {
    logs = logger.getErrorLogs(limit);
  } else {
    logs = logger.getRecentLogs(limit);
  }

  res.status(200).json({
    logs,
    count: logs.length,
    timestamp: new Date().toISOString()
  });
}));

export default router;
