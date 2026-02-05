import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { users } from "@shared/schema";
import { db } from "./db";
import { getAuth } from "@clerk/express"; // Use Clerk instead of Passport

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // 1. Get Current User (Clerk version)
  app.get("/api/auth/user", async (req, res) => {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    // Fetch user details from your Neon DB using the Clerk ID
    const user = await storage.getUser(userId);
    res.json(user || { id: userId, username: "Guest" });
  });

  // 2. List Kudos
  app.get(api.kudos.list.path, async (req, res) => {
    const kudos = await storage.getKudos();
    res.json(kudos);
  });

  // 3. Create Kudo
  app.post(api.kudos.create.path, async (req, res) => {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const input = api.kudos.create.input.parse(req.body);
      
      // Override fromUserId with the Clerk User ID for security
      input.fromUserId = userId;

      const kudo = await storage.createKudo(input);
      res.status(201).json(kudo);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // 4. List all Users (for the dropdown/selection)
  app.get(api.users.list.path, async (req, res) => {
    const allUsers = await storage.getAllUsers();
    res.json(allUsers);
  });

  // 5. Hide/Delete Kudo (Admin only)
  app.post("/api/kudos/:id/hide", async (req, res) => {
    const { userId } = getAuth(req);
    // In a real app, we'd check if this userId has 'admin' role
    // For this story, we'll allow any authenticated user to act as admin for testing
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const kudoId = parseInt(req.params.id);
      await storage.hideKudo(kudoId);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: "Failed to hide kudo" });
    }
  });

  // Run the seed to make sure you have people to give kudos to!
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingUsers = await storage.getAllUsers();
  if (existingUsers.length === 0) {
    const dummyUsers = [
      { id: "seed_1", firstName: "Alice", lastName: "Engineer", email: "alice@example.com" },
      { id: "seed_2", firstName: "Bob", lastName: "Designer", email: "bob@example.com" }
    ];
    for (const u of dummyUsers) {
      await db.insert(users).values(u);
    }
    console.log("Database seeded with dummy users.");
  }
}