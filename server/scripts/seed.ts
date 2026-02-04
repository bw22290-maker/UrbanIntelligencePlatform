import { db } from '../db';
import { users, projects, landUseZones, trafficNodes, environmentalMetrics, activityLogs } from '@shared/schema';
import { logger } from '../middleware/logger';
import { eq } from 'drizzle-orm';

async function seedDatabase() {
  try {
    logger.logInfo('Starting database seeding...');

    // Check if data already exists
    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers.length > 0) {
      logger.logInfo('Database already contains data, skipping seeding');
      process.exit(0);
    }

    // Seed users
    const [adminUser] = await db.insert(users).values([
      {
        id: 'admin-user-id',
        email: 'admin@urbanintelligence.com',
        role: 'admin',
        firstName: 'System',
        lastName: 'Administrator'
      },
      {
        id: 'brian-user-id',
        email: 'bmutunga@urbanintelligence.com',
        role: 'planner',
        firstName: 'Brian',
        lastName: 'Mutunga'
      }
    ]).returning();

    logger.logInfo('Seeded users');

    // Seed sample projects
    const sampleProjects = await db.insert(projects).values([
      {
        name: 'Downtown Revitalization',
        description: 'Comprehensive downtown area redevelopment with mixed-use zoning',
        type: 'mixed',
        status: 'active',
        userId: adminUser.id,
        progress: 25
      },
      {
        name: 'Traffic Flow Optimization',
        description: 'Smart traffic management system implementation',
        type: 'traffic',
        status: 'planning',
        userId: adminUser.id,
        progress: 10
      }
    ]).returning();

    logger.logInfo('Seeded projects');

    // Seed land use zones
    await db.insert(landUseZones).values([
      {
        name: 'Central Business District',
        zoneType: 'commercial',
        coordinates: { latitude: -1.2921, longitude: 36.8219 },
        projectId: sampleProjects[0].id,
        efficiency: '85.50'
      },
      {
        name: 'Residential Zone A',
        zoneType: 'residential',
        coordinates: { latitude: -1.3021, longitude: 36.8319 },
        projectId: sampleProjects[0].id,
        efficiency: '78.25'
      }
    ]);

    logger.logInfo('Seeded land use zones');

    // Seed traffic nodes
    await db.insert(trafficNodes).values(
      {
        name: 'Main Street Intersection',
        nodeType: 'intersection',
        latitude: -1.2921,
        longitude: 36.8219,
        flowRate: 1500,
        projectId: sampleProjects[1].id,
        efficiency: '75.00'
      }
    );

    logger.logInfo('Seeded traffic nodes');

    // Seed environmental metrics
    await db.insert(environmentalMetrics).values(
      {
        projectId: sampleProjects[0].id,
        metricType: 'air_quality',
        value: '75.500',
        unit: 'AQI',
        latitude: -1.2921,
        longitude: 36.8219
      }
    );

    logger.logInfo('Seeded environmental metrics');

    // Seed activity logs
    await db.insert(activityLogs).values([
      {
        userId: adminUser.id,
        action: 'create',
        entityType: 'project',
        entityId: sampleProjects[0].id,
        description: 'Created downtown revitalization project'
      },
      {
        userId: adminUser.id,
        action: 'update',
        entityType: 'land_use_zone',
        entityId: 1,
        description: 'Updated central business district zone'
      }
    ]);

    logger.logInfo('Seeded activity logs');
    logger.logInfo('Database seeding completed successfully');

    process.exit(0);
  } catch (error) {
    logger.logError('Database seeding failed', error);
    process.exit(1);
  }
}

seedDatabase();
