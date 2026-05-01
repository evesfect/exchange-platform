// scripts/seed.ts
// Populates the database with sample data for local development/testing.
// Run with: npx tsx scripts/seed.ts

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { config } from "dotenv";
import { users, listings, bids } from "../lib/schema";
import { hash } from "bcryptjs";

config({ path: ".env.local" });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const sampleUsers = [
  { email: "alice@example.com", password: "password123" },
  { email: "bob@example.com", password: "password123" },
  { email: "charlie@example.com", password: "password123" },
];

const sampleListings = [
  {
    title: "MacBook Pro 2023 M2",
    description: "Lightly used MacBook Pro 14-inch, M2 chip, 16GB RAM. Comes with charger and original box.",
    price: "1200.00",
    category: "Electronics",
    condition: "Like New",
    deliveryMethod: "In Person",
    sellerName: "Alice",
    location: "Kadıköy, Istanbul",
  },
  {
    title: "Calculus Textbook (Stewart 9th Ed)",
    description: "Used for MATH201. Some highlighting but in good shape overall.",
    price: "25.00",
    category: "Books",
    condition: "Good",
    deliveryMethod: "In Person",
    sellerName: "Bob",
    location: "Beşiktaş, Istanbul",
  },
  {
    title: "IKEA Desk Lamp",
    description: "White IKEA desk lamp, adjustable arm. Perfect for dorm rooms.",
    price: "15.00",
    category: "Furniture",
    condition: "Good",
    deliveryMethod: "In Person",
    sellerName: "Charlie",
    location: "Sarıyer, Istanbul",
  },
  {
    title: "iPhone 14 Pro Case",
    description: "Brand new MagSafe case, dark blue color. Never opened.",
    price: "10.00",
    category: "Electronics",
    condition: "New",
    deliveryMethod: "Shipping",
    sellerName: "Alice",
    location: "Kadıköy, Istanbul",
  },
  {
    title: "Organic Chemistry Notes Bundle",
    description: "Complete handwritten notes for CHEM301. Covers full semester.",
    price: "8.00",
    category: "Books",
    condition: "Good",
    deliveryMethod: "Digital",
    sellerName: "Bob",
    location: "Beşiktaş, Istanbul",
  },
  {
    title: "Mini Fridge",
    description: "Compact dorm fridge, 3.2 cu ft. Works perfectly, selling because I'm moving.",
    price: "60.00",
    category: "Furniture",
    condition: "Used",
    deliveryMethod: "In Person",
    sellerName: "Charlie",
    location: "Üsküdar, Istanbul",
  },
  {
    title: "Guitar – Yamaha F310",
    description: "Acoustic guitar in great condition. Includes gig bag and capo.",
    price: "90.00",
    category: "Music",
    condition: "Good",
    deliveryMethod: "In Person",
    sellerName: "Alice",
    location: "Kadıköy, Istanbul",
  },
  {
    title: "Winter Jacket (Size M)",
    description: "North Face puffer jacket, barely worn. Warm and lightweight.",
    price: "45.00",
    category: "Clothing",
    condition: "Like New",
    deliveryMethod: "In Person",
    sellerName: "Bob",
    location: "Şişli, Istanbul",
  },
  {
    title: "Wireless Mouse – Logitech MX Master 3",
    description: "Ergonomic wireless mouse. USB-C charging, Bluetooth. Used for 6 months.",
    price: "35.00",
    category: "Electronics",
    condition: "Good",
    deliveryMethod: "Shipping",
    sellerName: "Charlie",
    location: "Bakırköy, Istanbul",
  },
  {
    title: "Yoga Mat",
    description: "6mm thick yoga mat, purple. Lightly used, no tears.",
    price: "12.00",
    category: "Sports",
    condition: "Good",
    deliveryMethod: "In Person",
    sellerName: "Alice",
    location: "Kadıköy, Istanbul",
  },
  {
    title: "Data Structures & Algorithms Textbook",
    description: "Cormen (CLRS) 4th edition. Essential for CS students.",
    price: "30.00",
    category: "Books",
    condition: "Like New",
    deliveryMethod: "In Person",
    sellerName: "Bob",
    location: "Beşiktaş, Istanbul",
  },
  {
    title: "Standing Desk Converter",
    description: "Adjustable standing desk riser. Fits on any table. Great for posture.",
    price: "75.00",
    category: "Furniture",
    condition: "Good",
    deliveryMethod: "In Person",
    sellerName: "Charlie",
    location: "Sarıyer, Istanbul",
  },
];

async function seed() {
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(bids);
  await db.delete(listings);
  await db.delete(users);
  console.log("Cleared existing data");

  // Insert users
  const insertedUsers: { id: number; email: string }[] = [];
  for (const u of sampleUsers) {
    const passwordHash = await hash(u.password, 10);
    const [user] = await db.insert(users).values({ email: u.email, passwordHash }).returning();
    insertedUsers.push(user);
  }
  console.log(`Inserted ${sampleUsers.length} users`);

  // Insert listings with userId assignment
  const listingsWithUsers = sampleListings.map((listing, i) => ({
    ...listing,
    userId: insertedUsers[i % insertedUsers.length].id,
  }));
  await db.insert(listings).values(listingsWithUsers);
  console.log(`Inserted ${sampleListings.length} listings`);

  console.log("Seed complete!");
  await pool.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
