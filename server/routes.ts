import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./replit_integrations/auth";
import { registerAuthRoutes } from "./replit_integrations/auth";
import { api } from "@shared/routes";
import { z } from "zod";
import { users } from "@shared/schema";
import { db } from "./db";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Replit Auth first
  await setupAuth(app);
  registerAuthRoutes(app);

  // API Routes
  app.get(api.kudos.list.path, async (req, res) => {
    const kudos = await storage.getKudos();
    res.json(kudos);
  });

  app.post(api.kudos.create.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const input = api.kudos.create.input.parse(req.body);
      
      // Ensure the 'fromUserId' matches the logged in user
      // req.user is populated by Replit Auth (passport)
      const user = req.user as any;
      const currentUserId = user.claims.sub;

      if (input.fromUserId !== currentUserId) {
        // We could override it or reject it. Let's override for safety.
        input.fromUserId = currentUserId;
      }

      const kudo = await storage.createKudo(input);
      res.status(201).json(kudo);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.users.list.path, async (req, res) => {
    // Optional: Require auth to see user list?
    // if (!req.isAuthenticated()) return res.status(401).send();
    
    const users = await storage.getAllUsers();
    res.json(users);
  });

  // Seed some dummy users if none exist (for demo purposes)
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingUsers = await storage.getAllUsers();
  if (existingUsers.length === 0) {
    // Add some dummy colleagues
    const dummyUsers = [
      {
        firstName: "Alice",
        lastName: "Engineer",
        email: "alice@example.com",
        profileImageUrl: "https://ui-avatars.com/api/?name=Alice+Engineer&background=random",
      },
      {
        firstName: "Bob",
        lastName: "Designer",
        email: "bob@example.com",
        profileImageUrl: "https://ui-avatars.com/api/?name=Bob+Designer&background=random",
      },
      {
        firstName: "Charlie",
        lastName: "Manager",
        email: "charlie@example.com",
        profileImageUrl: "https://ui-avatars.com/api/?name=Charlie+Manager&background=random",
      }
    ];

    for (const u of dummyUsers) {
      await db.insert(users).values(u);
    }
    console.log("Seeded dummy users");
  }
}
