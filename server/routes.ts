import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStatsSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/stats", async (_req, res) => {
    const stats = await storage.getStats();
    res.json(stats);
  });

  app.post("/api/stats", async (req, res) => {
    const body = insertStatsSchema.parse(req.body);
    const stats = await storage.updateStats(body);
    res.json(stats);
  });

  const httpServer = createServer(app);
  return httpServer;
}
