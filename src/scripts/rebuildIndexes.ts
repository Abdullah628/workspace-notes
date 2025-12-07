/* eslint-disable no-console */
import mongoose from "mongoose";
import { envVars } from "../config/env";
import { Note } from "../modules/note/note.model";

async function rebuildIndexes() {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("Connected to database");

    console.log("🔄 Dropping old indexes...");
    await Note.collection.dropIndexes();
    console.log("✅ Old indexes dropped");

    console.log("🔄 Creating new optimized indexes...");
    await Note.createIndexes();
    console.log("✅ New indexes created");

    const indexes = await Note.collection.getIndexes();
    console.log("\n📊 Current indexes:");
    Object.keys(indexes).forEach((indexName) => {
      console.log(`  - ${indexName}:`, indexes[indexName]);
    });

    console.log("\n🎉 Index rebuild complete!");
    
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database");
  }
}

rebuildIndexes();
