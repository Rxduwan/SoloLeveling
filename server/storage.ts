import { stats, type Stats, type InsertStats } from "@shared/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

export interface IStorage {
  getStats(): Promise<Stats>;
  updateStats(newStats: InsertStats): Promise<Stats>;
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
}

export const storage = new PostgresStorage();