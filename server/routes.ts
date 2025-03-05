import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStatsSchema, insertObjectiveSchema } from "@shared/schema";

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

  app.get("/api/objectives", async (_req, res) => {
    const objectives = await storage.getObjectives();
    res.json(objectives);
  });

  app.post("/api/objectives", async (req, res) => {
    const body = insertObjectiveSchema.parse(req.body);
    const objective = await storage.createObjective(body);
    res.json(objective);
  });

  app.post("/api/objectives/:id/toggle", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid objective ID" });
      return;
    }
    const objective = await storage.toggleObjective(id);
    res.json(objective);
  });

  const httpServer = createServer(app);
  return httpServer;
}