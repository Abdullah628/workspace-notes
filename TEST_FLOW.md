# ✅ PRODUCTION-READY USER FLOW TEST

## 🔐 Step 1: User Registration (Auto-creates Company)

```bash
POST http://localhost:5000/api/v1/auth/register
Content-Type: application/json

{
  "companyName": "Acme Corporation",
  "name": "John Doe",
  "email": "john@acme.com",
  "password": "Password1!"
}
```

**Expected Response:**
- ✅ Company auto-created
- ✅ User created as OWNER
- ✅ User linked to company (`user.company = company._id`)
- ✅ Returns user with populated company

---

## 🔑 Step 2: User Login

```bash
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "john@acme.com",
  "password": "Password1!"
}
```

**Expected Response:**
- ✅ JWT tokens issued
- ✅ Token contains: `userId`, `email`, `role`, `companyId`
- ✅ httpOnly cookies set

---

## 📁 Step 3: Create Workspace (OWNER Only)

```bash
POST http://localhost:5000/api/v1/workspaces
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "companyId": "<your_company_id>",
  "name": "Engineering Team",
  "description": "Main engineering workspace"
}
```

**Expected Response:**
- ✅ Workspace created
- ✅ Only OWNER can create (MEMBERs rejected)
- ✅ Workspace belongs to company
- ✅ `createdBy` = current user

---

## 📝 Step 4: Create Note (Draft)

```bash
POST http://localhost:5000/api/v1/notes
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "workspaceId": "<workspace_id>",
  "companyId": "<company_id>",
  "title": "Architecture Design",
  "content": "Initial draft of system architecture",
  "tags": ["design", "architecture"],
  "type": "private",
  "isDraft": true
}
```

**Expected Response:**
- ✅ Note created with full tenant isolation
- ✅ Has: `companyId`, `workspaceId`, `authorUserId`
- ✅ Draft note (`isDraft: true`)
- ✅ Not visible in public directory

---

## 📢 Step 5: Publish Note (Make Public)

```bash
PATCH http://localhost:5000/api/v1/notes/<note_id>
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "type": "public",
  "isDraft": false
}
```

**Expected Response:**
- ✅ History entry auto-created with previous state
- ✅ Note now public and published
- ✅ Visible in public directory
- ✅ Votable by other users

---

## 🔍 Step 6: Browse Public Directory

```bash
GET http://localhost:5000/api/v1/notes/public-directory?q=architecture&sort=upvotes
```

**Expected Response:**
- ✅ Only shows: `type = "public"` AND `isDraft = false`
- ✅ Search by title
- ✅ Sort by: new, old, upvotes, downvotes
- ✅ Drafts excluded

---

## 👍 Step 7: Vote on Public Note

```bash
POST http://localhost:5000/api/v1/votes
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "noteId": "<note_id>",
  "voterUserId": "<user_id>",
  "type": "up"
}
```

**Expected Response:**
- ✅ Vote only allowed on public published notes
- ✅ Private/draft notes rejected
- ✅ Auto-recalculates upvotes/downvotes
- ✅ Unique vote per user per note

---

## 📜 Step 8: View History

```bash
GET http://localhost:5000/api/v1/history/note/<note_id>
Authorization: Bearer <accessToken>
```

**Expected Response:**
- ✅ Lists all history entries
- ✅ Shows: previous content, title, timestamp, changedBy user
- ✅ Entries auto-deleted after 7 days

---

## ⏮️ Step 9: Restore from History

```bash
POST http://localhost:5000/api/v1/notes/<note_id>/history/<history_id>/restore
Authorization: Bearer <accessToken>
```

**Expected Response:**
- ✅ Note restored to previous version
- ✅ Content and title reverted
- ✅ New history entry created

---

## 🔒 SECURITY & MULTI-TENANCY GUARANTEES

### ✅ Registration Flow
- User registers → Company auto-created
- User becomes OWNER automatically
- Email unique globally (company auto-assigned)

### ✅ JWT Token Contains
```json
{
  "userId": "...",
  "email": "...",
  "role": "OWNER",
  "companyId": "..."  // ← Multi-tenant isolation
}
```

### ✅ Workspace Creation
- **Only OWNER** can create workspaces
- MEMBERs receive `403 Forbidden`
- Workspace belongs to company

### ✅ Note Tenant Isolation
Every note MUST have:
- `companyId` ← Tenant partition
- `workspaceId` ← Workspace scope
- `authorUserId` ← Creator

### ✅ Draft/Publish Logic
- `isDraft: true` → Not in public listings
- Public requires: `type: "public"` AND `isDraft: false`

### ✅ Voting Rules
- Only on `type: "public"` AND `isDraft: false`
- Private/draft notes rejected with `403`

### ✅ History System
- Auto-creates on every note update
- Stores: previous content, title, user, timestamp
- Auto-deletes entries older than 7 days (job runs every 6 hours)

---

## 🎯 TEST SEEDER

Run the large data seeder:
```bash
npm run seed:large
```

**Creates:**
- 50 companies
- 4-9 users per company (1 OWNER + 3-8 MEMBERs)
- ~1,000 workspaces (created by OWNERs)
- ~500,000 notes with realistic distribution

**Test Credentials:**
- Email: `owner@company1.com`
- Password: `Password1!`

---

## 📊 ARCHITECTURE SUMMARY

```
┌─────────────────────────────────────────────┐
│  1. User Registers                          │
│     → Company Auto-Created                  │
│     → User = OWNER                          │
│     → user.company = company._id            │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  2. JWT Token Issued                        │
│     → { userId, email, role, companyId }    │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  3. OWNER Creates Workspace                 │
│     → MEMBER cannot create (403)            │
│     → workspace.companyId = user.company    │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  4. Create Notes (Draft/Publish)            │
│     → Full tenant isolation                 │
│     → companyId + workspaceId + authorId    │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  5. Draft → Publish → Vote → History        │
│     → isDraft controls visibility           │
│     → Auto-history on updates               │
│     → Vote only on public published         │
└─────────────────────────────────────────────┘
```

---

## ✅ ALL REQUIREMENTS IMPLEMENTED

### ✓ Multi-Tenant Architecture
- Companies are top-level tenants
- Users belong to companies (OWNER/MEMBER roles)
- Full data isolation by companyId

### ✓ Workspaces
- Company can have multiple workspaces
- Only OWNER can create workspaces
- Each workspace contains many notes

### ✓ Notes
- Title, content, tags
- Type: public/private
- Draft mode support
- Created/updated timestamps
- Votes (upvotes/downvotes)

### ✓ Draft Mode
- `isDraft: true` saves incomplete work
- Drafts excluded from public listings
- Publish by setting: `type: "public"`, `isDraft: false`

### ✓ History System (7-Day Retention)
- Auto-creates history on every update
- Stores: previous content, title, user, timestamp
- Restore functionality
- Auto-deletes entries older than 7 days

### ✓ Voting System
- Upvote/downvote on public notes
- Restricted to public published notes only
- Auto-recalculates counts
- Unique vote per user per note

### ✓ Production Flow
1. Register → Company auto-created
2. Login → JWT with companyId
3. Create Workspace (OWNER only)
4. Create Notes (draft/publish)
5. Draft → Publish → Vote → History

---

🚀 **Backend is 100% production-ready with proper multi-tenant SaaS architecture!**
