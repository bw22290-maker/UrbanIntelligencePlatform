import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

// Rate limiting configuration
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 1000 : 1000, // Increased limit for production
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// API rate limiting (stricter)
const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 500 : 500, // Increased API limit
  message: {
    error: 'Too many API requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration
const corsConfig = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // In production, allow the Render domain
    if (process.env.NODE_ENV === 'production') {
      const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [
        'https://urban-intelligence-platform.onrender.com',
        'https://urban-intelligence-platform.onrender.com/'
      ];
      
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    } else {
      // In development, allow localhost
      const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [
        'http://localhost:3000', 
        'http://localhost:5000'
      ];
      
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// Security headers configuration
const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", process.env.NODE_ENV === 'development' ? "'unsafe-inline'" : ""],
      connectSrc: ["'self'", process.env.NODE_ENV === 'development' ? "ws:" : "wss:"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      scriptSrcAttr: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : [],
    },
  },
  crossOriginEmbedderPolicy: false, // Disabled for compatibility
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
};

// Request validation middleware
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  // Validate content type for POST/PUT requests
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && !req.is('application/json')) {
    return res.status(400).json({ error: 'Content-Type must be application/json' });
  }
  
  // Check for suspicious headers
  const suspiciousHeaders = ['x-forwarded-host', 'x-original-url'];
  for (const header of suspiciousHeaders) {
    if (req.headers[header]) {
      return res.status(400).json({ error: 'Suspicious request detected' });
    }
  }
  
  next();
};

// Trust proxy configuration
export const trustProxy = (app: any) => {
  if (process.env.TRUST_PROXY === 'true') {
    app.set('trust proxy', 1);
  }
};

export {
  rateLimiter,
  apiRateLimiter,
  corsConfig,
  helmetConfig
};
