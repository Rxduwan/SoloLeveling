import { stats, objectives, type Stats, type InsertStats, type Objective, type InsertObjective } from "@shared/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and, lt, gte } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

export interface IStorage {
  getStats(): Promise<Stats>;
  updateStats(newStats: InsertStats): Promise<Stats>;
  getObjectives(): Promise<Objective[]>;
  createObjective(objective: InsertObjective): Promise<Objective>;
  toggleObjective(id: number): Promise<Objective>;
  clearOldObjectives(): Promise<void>;
}

export class PostgresStorage implements IStorage {
  async getStats(): Promise<Stats> {
    const results = await db.select().from(stats).limit(1);
    if (results.length === 0) {
      const defaultStats = {
        healthXP: 0,
        financeXP: 0,
        deenXP: 0,
        intellectXP: 0,
      };
      const [newStats] = await db.insert(stats).values(defaultStats).returning();
      return newStats;
    }
    return results[0];
  }

  async updateStats(newStats: InsertStats): Promise<Stats> {
    const [existingStats] = await db.select().from(stats).limit(1);
    if (!existingStats) {
      // Ensure no negative values in initial stats
      const sanitizedStats = {
        healthXP: Math.max(0, newStats.healthXP),
        financeXP: Math.max(0, newStats.financeXP),
        deenXP: Math.max(0, newStats.deenXP),
        intellectXP: Math.max(0, newStats.intellectXP),
      };
      const [stats] = await db.insert(stats).values(sanitizedStats).returning();
      return stats;
    }

    // Calculate new values ensuring they don't go below 0
    const updatedValues = {
      healthXP: Math.max(0, newStats.healthXP ?? existingStats.healthXP),
      financeXP: Math.max(0, newStats.financeXP ?? existingStats.financeXP),
      deenXP: Math.max(0, newStats.deenXP ?? existingStats.deenXP),
      intellectXP: Math.max(0, newStats.intellectXP ?? existingStats.intellectXP),
    };

    const [updatedStats] = await db
      .update(stats)
      .set(updatedValues)
      .where(eq(stats.id, existingStats.id))
      .returning();
    return updatedStats;
  }

  async getObjectives(): Promise<Objective[]> {
    // Get today's date at midnight UK time
    const now = new Date();
    const ukMidnight = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0)
    );

    return await db
      .select()
      .from(objectives)
      .where(gte(objectives.createdAt, ukMidnight))
      .orderBy(objectives.createdAt);
  }

  async createObjective(objective: InsertObjective): Promise<Objective> {
    const [newObjective] = await db
      .insert(objectives)
      .values(objective)
      .returning();
    return newObjective;
  }

  async toggleObjective(id: number): Promise<Objective> {
    const [objective] = await db
      .select()
      .from(objectives)
      .where(eq(objectives.id, id));

    if (!objective) {
      throw new Error("Objective not found");
    }

    const [updatedObjective] = await db
      .update(objectives)
      .set({ completed: !objective.completed })
      .where(eq(objectives.id, id))
      .returning();

    return updatedObjective;
  }

  async clearOldObjectives(): Promise<void> {
    // Get today's date at midnight UK time
    const now = new Date();
    const ukMidnight = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0)
    );

    await db
      .delete(objectives)
      .where(lt(objectives.createdAt, ukMidnight));
  }
}

export const storage = new PostgresStorage();