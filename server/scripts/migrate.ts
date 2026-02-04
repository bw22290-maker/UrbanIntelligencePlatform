import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from '../db';
import { logger } from '../middleware/logger';

async function runMigrations() {
  try {
    logger.logInfo('Starting database migrations...');
    
    await migrate(db, { migrationsFolder: './migrations' });
    
    logger.logInfo('Database migrations completed successfully');
    process.exit(0);
  } catch (error) {
    logger.logError('Database migration failed', error);
    process.exit(1);
  }
}

runMigrations();
