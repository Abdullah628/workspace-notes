/* eslint-disable no-console */
import mongoose, { Types } from "mongoose";
import { envVars } from "../config/env";
import { Company } from "../modules/company/company.model";
import { Workspace } from "../modules/workspace/workspace.model";
import { Note } from "../modules/note/note.model";
import { User } from "../modules/user/user.model";
import { hashPassword } from "../utils/hash";

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

const titles = ["Meeting notes", "Roadmap", "Release plan", "Incident report", "Design doc", "API spec", "Runbook", "Onboarding"];
const tagsPool = ["dev", "ops", "marketing", "sales", "security", "infra", "product", "qa", "design"];
const names = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Henry", "Ivy", "Jack"];

async function run() {
  await mongoose.connect(envVars.DB_URL);
  console.log("Seeding with proper registration flow...");

  const hashedPassword = await hashPassword("Password1!");

  // Create 50 companies with users (simulating registration flow)
  const companyUserMap: { companyId: Types.ObjectId; users: Types.ObjectId[]; ownerId: Types.ObjectId }[] = [];
  
  for (let i = 0; i < 50; i++) {
    // Step 1: Create company (auto-created during registration)
    const company = await Company.create({ name: `Company ${i+1}` });

    // Step 2: Create owner (first user who registered)
    const owner = await User.create({
      company: company._id,
      name: `${pick(names)} Owner`,
      email: `owner@company${i+1}.com`,
      password: hashedPassword,
      role: "OWNER",
      auths: [{ provider: "credentials", providerId: `owner@company${i+1}.com` }],
    });

    const users = [owner._id];

    // Step 3: Create additional members (3-8 members per company)
    const membersCount = rand(3, 8);
    for (let j = 0; j < membersCount; j++) {
      const member = await User.create({
        company: company._id,
        name: `${pick(names)} ${j+1}`,
        email: `member${j}@company${i+1}.com`,
        password: hashedPassword,
        role: "MEMBER",
        auths: [{ provider: "credentials", providerId: `member${j}@company${i+1}.com` }],
      });
      users.push(member._id);
    }

    companyUserMap.push({ companyId: company._id, users, ownerId: owner._id });
  }

  console.log(`Created ${companyUserMap.length} companies with ${companyUserMap.reduce((sum, c) => sum + c.users.length, 0)} users`);

  // Step 4: Create ~1,000 workspaces (only by OWNERs)
  const workspaceCompanyMap: { workspaceId: Types.ObjectId; companyId: Types.ObjectId; users: Types.ObjectId[] }[] = [];
  
  for (let i = 0; i < 1000; i++) {
    const companyData = pick(companyUserMap);
    
    const workspace = await Workspace.create({ 
      companyId: companyData.companyId, 
      name: `Workspace ${i+1}`, 
      description: `Description for workspace ${i+1}`,
      createdBy: companyData.ownerId // Only owner can create workspaces
    });
    
    workspaceCompanyMap.push({ 
      workspaceId: workspace._id, 
      companyId: companyData.companyId, 
      users: companyData.users 
    });
  }

  console.log(`Created ${workspaceCompanyMap.length} workspaces`);

  // Step 5: Create ~500,000 notes in batches
  const batchSize = 5000;
  const totalNotes = 500000;
  let inserted = 0;
  
  while (inserted < totalNotes) {
    const batch: any[] = [];
    for (let j = 0; j < batchSize && inserted < totalNotes; j++) {
      const wsData = pick(workspaceCompanyMap);
      const authorUserId = pick(wsData.users);
      const title = `${pick(titles)} ${inserted+1}`;
      const content = `Content for note ${inserted+1}. Lorem ipsum dolor sit amet.`;
      const tags = Array.from(new Set(Array.from({ length: rand(1, 4) }, () => pick(tagsPool))));
      const type = Math.random() < 0.6 ? "private" : "public";
      const isDraft = Math.random() < 0.2;
      
      batch.push({ 
        workspaceId: wsData.workspaceId, 
        companyId: wsData.companyId, 
        authorUserId, 
        title, 
        content, 
        tags, 
        type, 
        isDraft, 
        upvotes: type === "public" && !isDraft ? rand(0, 100) : 0,
        downvotes: type === "public" && !isDraft ? rand(0, 50) : 0,
        createdAt: new Date(), 
        updatedAt: new Date() 
      });
      inserted++;
    }
    await Note.collection.insertMany(batch, { ordered: false });
    console.log(`Inserted ${inserted}/${totalNotes} notes`);
  }

  console.log("✅ Seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`  - Companies: ${companyUserMap.length}`);
  console.log(`  - Users: ${companyUserMap.reduce((sum, c) => sum + c.users.length, 0)}`);
  console.log(`  - Workspaces: ${workspaceCompanyMap.length}`);
  console.log(`  - Notes: ${totalNotes}`);
  console.log("\n🔐 Test Credentials:");
  console.log("  Email: owner@company1.com");
  console.log("  Password: Password1!");
  
  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
