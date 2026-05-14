// lib/schema.ts
import { pgTable, serial, varchar, timestamp, text, numeric, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url"),
  category: varchar("category", { length: 100 }),
  condition: varchar("condition", { length: 100 }),
  deliveryMethod: varchar("delivery_method", { length: 100 }),
  sellerName: varchar("seller_name", { length: 100 }),
  location: varchar("location", { length: 255 }),
  userId: integer("user_id").references(() => users.id),
  biddingStartsAt: timestamp("bidding_starts_at"),
  biddingEndsAt: timestamp("bidding_ends_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bids = pgTable("bids", {
  id: serial("id").primaryKey(),
  listingId: integer("listing_id").notNull().references(() => listings.id),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),

  listingId: integer("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),

  senderId: integer("sender_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  message: text("message").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});