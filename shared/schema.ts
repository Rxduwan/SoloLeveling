import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  healthXP: integer("health_xp").notNull().default(0),
  financeXP: integer("finance_xp").notNull().default(0),
  deenXP: integer("deen_xp").notNull().default(0),
  intellectXP: integer("intellect_xp").notNull().default(0),
});

export const insertStatsSchema = createInsertSchema(stats).pick({
  healthXP: true,
  financeXP: true,
  deenXP: true,
  intellectXP: true,
});

export type InsertStats = z.infer<typeof insertStatsSchema>;
export type Stats = typeof stats.$inferSelect;