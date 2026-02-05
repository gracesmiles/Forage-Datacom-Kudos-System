import { users, kudos, type User, type UpsertUser, type InsertKudo, type Kudo, type KudoWithUser } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  upsertUser(user: UpsertUser): Promise<User>; // Changed from createUser to upsertUser
  createKudo(kudo: InsertKudo): Promise<Kudo>;
  getKudos(): Promise<KudoWithUser[]>;
  hideKudo(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // This is vital for Clerk. If the user exists, update them; if not, create them.
  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async createKudo(kudo: InsertKudo): Promise<Kudo> {
    const [newKudo] = await db.insert(kudos).values(kudo).returning();
    return newKudo;
  }

  async getKudos() {
  return await db.query.kudos.findMany({
    with: {
      fromUser: true,
      toUser: true,
    },
  });
}

  async hideKudo(id: number): Promise<void> {
    await db.update(kudos).set({ hidden: true }).where(eq(kudos.id, id));
  }
}

export const storage = new DatabaseStorage();