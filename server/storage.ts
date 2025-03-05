import { type Stats, type InsertStats } from "@shared/schema";

export interface IStorage {
  getStats(): Promise<Stats>;
  updateStats(stats: InsertStats): Promise<Stats>;
}

export class MemStorage implements IStorage {
  private stats: Stats;

  constructor() {
    this.stats = {
      id: 1,
      healthXP: 0,
      financeXP: 0,
      deenXP: 0,
    };
  }

  async getStats(): Promise<Stats> {
    return this.stats;
  }

  async updateStats(newStats: InsertStats): Promise<Stats> {
    this.stats = { ...this.stats, ...newStats };
    return this.stats;
  }
}

export const storage = new MemStorage();
