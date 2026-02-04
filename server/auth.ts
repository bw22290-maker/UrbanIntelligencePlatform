import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: sessionTtl,
    },
  });
}

// Simple mock user for development
const mockUser = {
  id: 'dev-user-123',
  email: 'admin@urbanintelligence.com',
  firstName: 'Development',
  lastName: 'User',
  role: 'admin',
  claims: {
    sub: 'dev-user-123',
    email: 'admin@urbanintelligence.com',
    first_name: 'Development',
    last_name: 'User'
  }
};

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());

  // Simple development authentication
  app.use((req, res, next) => {
    // Auto-login for development
    if (process.env.NODE_ENV === 'development' && !req.session?.user) {
      req.session.user = mockUser;
    }
    next();
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  // Allow access in both development and production for now
  req.user = mockUser;
  return next();

  // Original production code (commented out for now)
  /*
  if (process.env.NODE_ENV === 'development') {
    // Always allow in development
    req.user = mockUser;
    return next();
  }

  const user = req.session?.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = user;
  next();
  */
};
