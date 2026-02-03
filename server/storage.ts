import { users, kudos, type User, type InsertUser, type InsertKudo, type Kudo, type KudoWithUser } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  
  createKudo(kudo: InsertKudo): Promise<Kudo>;
  getKudos(): Promise<KudoWithUser[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // Note: Replit Auth uses email/id, but for compatibility we might check other fields if needed.
    // users table has firstName, lastName, email.
    // This method might be less relevant with Replit Auth but keeping for interface compatibility if needed.
    return undefined; 
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createKudo(kudo: InsertKudo): Promise<Kudo> {
    const [newKudo] = await db.insert(kudos).values(kudo).returning();
    return newKudo;
  }

  async getKudos(): Promise<KudoWithUser[]> {
    const results = await db.query.kudos.findMany({
      orderBy: [desc(kudos.createdAt)],
      with: {
        fromUser: true,
        toUser: true,
      },
    });
    return results;
  }
}

export const storage = new DatabaseStorage();
