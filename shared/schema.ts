import { pgTable, text, serial, integer, boolean, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";


// Export auth models
export * from "./models/auth";
import { users } from "./models/auth";

export const kudos = pgTable("kudos", {
  id: serial("id").primaryKey(),
  fromUserId: text("from_user_id").notNull().references(() => users.id),
  toUserId: text("to_user_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  category: text("category").notNull(), // 'Teamwork', 'Innovation', 'Helpful', 'Other'
  hidden: boolean("hidden").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const kudosRelations = relations(kudos, ({ one }) => ({
  fromUser: one(users, {
    fields: [kudos.fromUserId],
    references: [users.id],
    relationName: "givenKudos"
  }),
  toUser: one(users, {
    fields: [kudos.toUserId],
    references: [users.id],
    relationName: "receivedKudos"
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  givenKudos: many(kudos, { relationName: "givenKudos" }),
  receivedKudos: many(kudos, { relationName: "receivedKudos" }),
}));

export const insertKudoSchema = createInsertSchema(kudos).omit({ id: true, createdAt: true });

export type Kudo = typeof kudos.$inferSelect;
export type InsertKudo = z.infer<typeof insertKudoSchema>;
// Frontend will receive expanded objects
export type KudoWithUser = Kudo & { 
  fromUser: typeof users.$inferSelect; 
  toUser: typeof users.$inferSelect 
};
