import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Metric from "./models/Metric.js";
import User from "./models/User.js";

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // clear existing data
    await User.deleteMany({});
    await Metric.deleteMany({});

    // create sample users
    const users = await User.insertMany([
      {
        name: "Alice Johnson",
        email: "alice@example.com",
        passwordHash: await bcrypt.hash("password123", 10),
      },
      {
        name: "Bob Martinez",
        email: "bob@example.com",
        passwordHash: await bcrypt.hash("password123", 10),
      },
    ]);

    console.log(`👥 Created ${users.length} users`);

    // create metrics for each user
    const metrics = [];

    for (const user of users) {
      metrics.push(
        {
          userId: user._id,
          name: "Daily Coding Time",
          description: "Number of hours spent coding each day",
          target: 3,
          unit: "hours",
          type: "cumulative",
          entries: [
            { date: new Date("2025-10-10"), value: 2.5 },
            { date: new Date("2025-10-11"), value: 3.0 },
            { date: new Date("2025-10-12"), value: 4.0 },
          ],
        },
        {
          userId: user._id,
          name: "Workout Sessions",
          description: "Number of workouts per week",
          target: 5,
          unit: "sessions",
          type: "latest",
          entries: [
            { date: new Date("2025-10-07"), value: 1 },
            { date: new Date("2025-10-09"), value: 1 },
            { date: new Date("2025-10-11"), value: 1 },
          ],
        }
      );
    }

    await Metric.insertMany(metrics);
    console.log(`📊 Created ${metrics.length} metrics`);

    console.log("🌱 Database successfully seeded!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

seed();
