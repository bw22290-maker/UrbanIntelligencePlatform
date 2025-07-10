import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { z } from "zod";
import { insertProjectSchema, insertLandUseZoneSchema, insertTrafficNodeSchema, insertEnvironmentalMetricSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard routes
  app.get('/api/dashboard/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getDashboardStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  app.get('/api/dashboard/activities', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const activities = await storage.getRecentActivities(userId);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Project routes
  app.get('/api/projects', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const projects = await storage.getProjects(userId);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get('/api/projects/:id', isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post('/api/projects', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const projectData = insertProjectSchema.parse({ ...req.body, userId });
      const project = await storage.createProject(projectData);
      
      // Log activity
      await storage.logActivity({
        userId,
        action: "create",
        entityType: "project",
        entityId: project.id,
        description: `Created project: ${project.name}`,
      });
      
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.put('/api/projects/:id', isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const projectData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(projectId, projectData);
      
      // Log activity
      await storage.logActivity({
        userId,
        action: "update",
        entityType: "project",
        entityId: projectId,
        description: `Updated project: ${project.name}`,
      });
      
      res.json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete('/api/projects/:id', isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      await storage.deleteProject(projectId);
      
      // Log activity
      await storage.logActivity({
        userId,
        action: "delete",
        entityType: "project",
        entityId: projectId,
        description: `Deleted project`,
      });
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Land use routes
  app.get('/api/projects/:id/land-use-zones', isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const zones = await storage.getLandUseZones(projectId);
      res.json(zones);
    } catch (error) {
      console.error("Error fetching land use zones:", error);
      res.status(500).json({ message: "Failed to fetch land use zones" });
    }
  });

  app.post('/api/projects/:id/land-use-zones', isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const zoneData = insertLandUseZoneSchema.parse({ ...req.body, projectId });
      const zone = await storage.createLandUseZone(zoneData);
      
      // Log activity
      await storage.logActivity({
        userId,
        action: "create",
        entityType: "zone",
        entityId: zone.id,
        description: `Created land use zone: ${zone.name}`,
      });
      
      res.status(201).json(zone);
    } catch (error) {
      console.error("Error creating land use zone:", error);
      res.status(500).json({ message: "Failed to create land use zone" });
    }
  });

  // Traffic routes
  app.get('/api/projects/:id/traffic-nodes', isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const nodes = await storage.getTrafficNodes(projectId);
      res.json(nodes);
    } catch (error) {
      console.error("Error fetching traffic nodes:", error);
      res.status(500).json({ message: "Failed to fetch traffic nodes" });
    }
  });

  app.post('/api/projects/:id/traffic-nodes', isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const nodeData = insertTrafficNodeSchema.parse({ ...req.body, projectId });
      const node = await storage.createTrafficNode(nodeData);
      
      // Log activity
      await storage.logActivity({
        userId,
        action: "create",
        entityType: "traffic_node",
        entityId: node.id,
        description: `Created traffic node: ${node.name}`,
      });
      
      res.status(201).json(node);
    } catch (error) {
      console.error("Error creating traffic node:", error);
      res.status(500).json({ message: "Failed to create traffic node" });
    }
  });

  // Environmental routes
  app.get('/api/projects/:id/environmental-metrics', isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const metrics = await storage.getEnvironmentalMetrics(projectId);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching environmental metrics:", error);
      res.status(500).json({ message: "Failed to fetch environmental metrics" });
    }
  });

  app.post('/api/projects/:id/environmental-metrics', isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const metricData = insertEnvironmentalMetricSchema.parse({ ...req.body, projectId });
      const metric = await storage.createEnvironmentalMetric(metricData);
      
      // Log activity
      await storage.logActivity({
        userId,
        action: "create",
        entityType: "environmental_metric",
        entityId: metric.id,
        description: `Recorded environmental metric: ${metric.metricType}`,
      });
      
      res.status(201).json(metric);
    } catch (error) {
      console.error("Error creating environmental metric:", error);
      res.status(500).json({ message: "Failed to create environmental metric" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
