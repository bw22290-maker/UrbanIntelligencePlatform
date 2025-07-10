import {
  users,
  projects,
  landUseZones,
  trafficNodes,
  environmentalMetrics,
  activityLogs,
  type User,
  type UpsertUser,
  type Project,
  type InsertProject,
  type LandUseZone,
  type InsertLandUseZone,
  type TrafficNode,
  type InsertTrafficNode,
  type EnvironmentalMetric,
  type InsertEnvironmentalMetric,
  type ActivityLog,
  type InsertActivityLog,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Project operations
  getProjects(userId: string): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: number): Promise<void>;
  
  // Land use operations
  getLandUseZones(projectId: number): Promise<LandUseZone[]>;
  createLandUseZone(zone: InsertLandUseZone): Promise<LandUseZone>;
  updateLandUseZone(id: number, zone: Partial<InsertLandUseZone>): Promise<LandUseZone>;
  deleteLandUseZone(id: number): Promise<void>;
  
  // Traffic operations
  getTrafficNodes(projectId: number): Promise<TrafficNode[]>;
  createTrafficNode(node: InsertTrafficNode): Promise<TrafficNode>;
  updateTrafficNode(id: number, node: Partial<InsertTrafficNode>): Promise<TrafficNode>;
  deleteTrafficNode(id: number): Promise<void>;
  
  // Environmental operations
  getEnvironmentalMetrics(projectId: number): Promise<EnvironmentalMetric[]>;
  createEnvironmentalMetric(metric: InsertEnvironmentalMetric): Promise<EnvironmentalMetric>;
  
  // Activity operations
  getRecentActivities(userId: string, limit?: number): Promise<ActivityLog[]>;
  logActivity(activity: InsertActivityLog): Promise<ActivityLog>;
  
  // Dashboard operations
  getDashboardStats(userId: string): Promise<{
    activeProjects: number;
    trafficEfficiency: number;
    environmentalScore: number;
    landUseEfficiency: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Project operations
  async getProjects(userId: string): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.updatedAt));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db
      .insert(projects)
      .values(project)
      .returning();
    return newProject;
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project> {
    const [updatedProject] = await db
      .update(projects)
      .set({ ...project, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Land use operations
  async getLandUseZones(projectId: number): Promise<LandUseZone[]> {
    return await db
      .select()
      .from(landUseZones)
      .where(eq(landUseZones.projectId, projectId));
  }

  async createLandUseZone(zone: InsertLandUseZone): Promise<LandUseZone> {
    const [newZone] = await db
      .insert(landUseZones)
      .values(zone)
      .returning();
    return newZone;
  }

  async updateLandUseZone(id: number, zone: Partial<InsertLandUseZone>): Promise<LandUseZone> {
    const [updatedZone] = await db
      .update(landUseZones)
      .set(zone)
      .where(eq(landUseZones.id, id))
      .returning();
    return updatedZone;
  }

  async deleteLandUseZone(id: number): Promise<void> {
    await db.delete(landUseZones).where(eq(landUseZones.id, id));
  }

  // Traffic operations
  async getTrafficNodes(projectId: number): Promise<TrafficNode[]> {
    return await db
      .select()
      .from(trafficNodes)
      .where(eq(trafficNodes.projectId, projectId));
  }

  async createTrafficNode(node: InsertTrafficNode): Promise<TrafficNode> {
    const [newNode] = await db
      .insert(trafficNodes)
      .values(node)
      .returning();
    return newNode;
  }

  async updateTrafficNode(id: number, node: Partial<InsertTrafficNode>): Promise<TrafficNode> {
    const [updatedNode] = await db
      .update(trafficNodes)
      .set(node)
      .where(eq(trafficNodes.id, id))
      .returning();
    return updatedNode;
  }

  async deleteTrafficNode(id: number): Promise<void> {
    await db.delete(trafficNodes).where(eq(trafficNodes.id, id));
  }

  // Environmental operations
  async getEnvironmentalMetrics(projectId: number): Promise<EnvironmentalMetric[]> {
    return await db
      .select()
      .from(environmentalMetrics)
      .where(eq(environmentalMetrics.projectId, projectId))
      .orderBy(desc(environmentalMetrics.recordedAt));
  }

  async createEnvironmentalMetric(metric: InsertEnvironmentalMetric): Promise<EnvironmentalMetric> {
    const [newMetric] = await db
      .insert(environmentalMetrics)
      .values(metric)
      .returning();
    return newMetric;
  }

  // Activity operations
  async getRecentActivities(userId: string, limit: number = 10): Promise<ActivityLog[]> {
    return await db
      .select()
      .from(activityLogs)
      .where(eq(activityLogs.userId, userId))
      .orderBy(desc(activityLogs.createdAt))
      .limit(limit);
  }

  async logActivity(activity: InsertActivityLog): Promise<ActivityLog> {
    const [newActivity] = await db
      .insert(activityLogs)
      .values(activity)
      .returning();
    return newActivity;
  }

  // Dashboard operations
  async getDashboardStats(userId: string): Promise<{
    activeProjects: number;
    trafficEfficiency: number;
    environmentalScore: number;
    landUseEfficiency: number;
  }> {
    const userProjects = await db
      .select()
      .from(projects)
      .where(and(eq(projects.userId, userId), eq(projects.status, "active")));

    const activeProjects = userProjects.length;

    // Calculate averages from project data
    const trafficEfficiency = userProjects.length > 0 ? 
      Math.round(userProjects.reduce((sum, p) => sum + (p.progress || 0), 0) / userProjects.length) : 0;

    const environmentalScore = 8.4; // This would be calculated from environmental metrics
    const landUseEfficiency = 92; // This would be calculated from land use zones

    return {
      activeProjects,
      trafficEfficiency,
      environmentalScore,
      landUseEfficiency,
    };
  }
}

export const storage = new DatabaseStorage();
