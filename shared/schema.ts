import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  healthXP: integer("health_xp").notNull().default(0),
  financeXP: integer("finance_xp").notNull().default(0),
  deenXP: integer("deen_xp").notNull().default(0),
  intellectXP: integer("intellect_xp").notNull().default(0),
});

export const objectives = pgTable("objectives", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertStatsSchema = createInsertSchema(stats).pick({
  healthXP: true,
  financeXP: true,
  deenXP: true,
  intellectXP: true,
});

export const insertObjectiveSchema = createInsertSchema(objectives).pick({
  text: true,
});

export type InsertStats = z.infer<typeof insertStatsSchema>;
export type Stats = typeof stats.$inferSelect;

export type InsertObjective = z.infer<typeof insertObjectiveSchema>;
export type Objective = typeof objectives.$inferSelect;