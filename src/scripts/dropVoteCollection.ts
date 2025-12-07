/* eslint-disable no-console */
import mongoose from "mongoose";
import { envVars } from "../config/env";

async function dropVoteCollection() {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("Connected to database");

    // Drop the votes collection (removes all data and indexes)
    await mongoose.connection.db.dropCollection("votes");
    console.log("✅ Votes collection dropped successfully!");
    console.log("The collection will be recreated with correct indexes on next vote operation.");
    
  } catch (error: any) {
    if (error.message.includes("ns not found")) {
      console.log("⚠️  Votes collection doesn't exist. Nothing to drop.");
    } else {
      console.error("❌ Error:", error.message);
    }
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database");
  }
}

dropVoteCollection();
