import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("planner"), // admin, planner, viewer
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Projects table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  type: varchar("type").notNull(), // land_use, traffic, environmental, mixed
  status: varchar("status").default("active"), // active, completed, archived
  progress: integer("progress").default(0),
  userId: varchar("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Land use zones table
export const landUseZones = pgTable("land_use_zones", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  zoneType: varchar("zone_type").notNull(), // residential, commercial, industrial, green
  coordinates: jsonb("coordinates"), // Store polygon coordinates as JSON
  efficiency: decimal("efficiency", { precision: 5, scale: 2 }).default("0.00"),
  projectId: integer("project_id").references(() => projects.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Traffic nodes table
export const trafficNodes = pgTable("traffic_nodes", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  nodeType: varchar("node_type").notNull(), // intersection, signal, roundabout
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  flowRate: integer("flow_rate").default(0),
  efficiency: decimal("efficiency", { precision: 5, scale: 2 }).default("0.00"),
  projectId: integer("project_id").references(() => projects.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Environmental metrics table
export const environmentalMetrics = pgTable("environmental_metrics", {
  id: serial("id").primaryKey(),
  metricType: varchar("metric_type").notNull(), // air_quality, green_coverage, noise_level
  value: decimal("value", { precision: 10, scale: 3 }).notNull(),
  unit: varchar("unit").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  projectId: integer("project_id").references(() => projects.id),
  recordedAt: timestamp("recorded_at").defaultNow(),
});

// Activity logs table
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  action: varchar("action").notNull(),
  entityType: varchar("entity_type").notNull(), // project, zone, simulation
  entityId: integer("entity_id"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas
export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLandUseZoneSchema = createInsertSchema(landUseZones).omit({
  id: true,
  createdAt: true,
});

export const insertTrafficNodeSchema = createInsertSchema(trafficNodes).omit({
  id: true,
  createdAt: true,
});

export const insertEnvironmentalMetricSchema = createInsertSchema(environmentalMetrics).omit({
  id: true,
  recordedAt: true,
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertLandUseZone = z.infer<typeof insertLandUseZoneSchema>;
export type LandUseZone = typeof landUseZones.$inferSelect;
export type InsertTrafficNode = z.infer<typeof insertTrafficNodeSchema>;
export type TrafficNode = typeof trafficNodes.$inferSelect;
export type InsertEnvironmentalMetric = z.infer<typeof insertEnvironmentalMetricSchema>;
export type EnvironmentalMetric = typeof environmentalMetrics.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;
