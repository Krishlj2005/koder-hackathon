import { pgTable, text, serial, integer, boolean, timestamp, varchar, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Projects table schema
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Documents table schema
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  name: text("name").notNull(),
  originalFilename: text("original_filename").notNull(),
  fileSize: integer("file_size").notNull(),
  fileType: text("file_type").notNull(),
  content: text("content"),
  extractedRequirements: json("extracted_requirements"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Figma designs table schema
export const figmaDesigns = pgTable("figma_designs", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  name: text("name").notNull(),
  figmaFileUrl: text("figma_file_url").notNull(),
  figmaFileKey: text("figma_file_key"),
  accessToken: text("access_token"),
  thumbnailUrl: text("thumbnail_url"),
  lastAccessed: timestamp("last_accessed").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Validations table schema
export const validations = pgTable("validations", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  status: text("status").notNull(),
  complianceScore: integer("compliance_score"),
  compliantElements: integer("compliant_elements"),
  inconsistencies: integer("inconsistencies"),
  results: json("results"),
});

// Test cases table schema
export const testCases = pgTable("test_cases", {
  id: serial("id").primaryKey(),
  validationId: integer("validation_id").references(() => validations.id),
  testCaseId: varchar("test_case_id", { length: 20 }).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(),
  severity: text("severity").notNull(),
  status: text("status").notNull(),
  requirement: text("requirement"),
  designElement: text("design_element"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Create insert schemas using drizzle-zod
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDocumentSchema = createInsertSchema(documents).omit({ id: true, content: true, extractedRequirements: true, createdAt: true });
export const insertFigmaDesignSchema = createInsertSchema(figmaDesigns).omit({ id: true, figmaFileKey: true, accessToken: true, thumbnailUrl: true, lastAccessed: true, createdAt: true });
export const insertValidationSchema = createInsertSchema(validations).omit({ id: true, completedAt: true, complianceScore: true, compliantElements: true, inconsistencies: true, results: true, startedAt: true });
export const insertTestCaseSchema = createInsertSchema(testCases).omit({ id: true, createdAt: true });

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

export type FigmaDesign = typeof figmaDesigns.$inferSelect;
export type InsertFigmaDesign = z.infer<typeof insertFigmaDesignSchema>;

export type Validation = typeof validations.$inferSelect;
export type InsertValidation = z.infer<typeof insertValidationSchema>;

export type TestCase = typeof testCases.$inferSelect;
export type InsertTestCase = z.infer<typeof insertTestCaseSchema>;
