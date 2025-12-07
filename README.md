# 🚀 Workspace Notes Backend

A production-ready multi-tenant SaaS backend for collaborative workspace notes with version history, public directory, and voting system.

## 📋 Features

- 🏢 **Multi-tenant Architecture** - Complete data isolation per company
- 👥 **Role-based Access Control** - OWNER and MEMBER roles
- 📝 **Note Management** - Create, edit, delete notes with draft mode
- 🔒 **Public/Private Notes** - Visibility control for notes
- 📊 **Voting System** - Upvote/downvote on public notes
- 🕒 **Version History** - 7-day automatic history retention
- 🔍 **Search & Filtering** - Search by title, sort by votes/date
- 🏷️ **Tags** - Organize notes with tags
- 🔐 **Authentication** - JWT-based auth with email domain matching
- ⚡ **Performance Monitoring** - Query performance tracking

---

## 🛠️ Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js 5
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **File Upload**: Cloudinary

---

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher)
- **MongoDB** (v6 or higher) - Local or Atlas
- **npm** or **yarn**

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd workspace-notes-backend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
DB_URL=mongodb://localhost:27017/workspace-notes
# OR use MongoDB Atlas:
# DB_URL=mongodb+srv://username:password@cluster.mongodb.net/workspace-notes

# JWT Configuration
JWT_ACCESS_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_ACCESS_EXPIRES_IN=7d

# Cloudinary (Optional - for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

> ⚠️ **Security Note**: Never commit `.env` file to version control. Change JWT secret in production.

---

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

Server will start at `http://localhost:5000`

### Production Build

```bash
npm run build
node dist/server.js
```

---

## 🌱 Database Seeding

Seed the database with test data (50 companies, ~300 users, 1000 workspaces, 500K notes):

```bash
npm run seed:large
```

**Test Login Credentials:**
```
Email: owner@company1.com
Password: Password1!
```

Or use any generated user:
- `owner@company2.com` / `Password1!`
- `member0@company1.com` / `Password1!`

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user (creates company if new domain) |
| POST | `/auth/login` | Login with email/password |
| POST | `/auth/logout` | Logout user |
| GET | `/user/me` | Get current user details |

### Company Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/companies/my` | Get current user's company |

### Workspace Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/workspaces` | Create workspace (OWNER only) |
| GET | `/workspaces/my` | Get all company workspaces |
| GET | `/workspaces/:id` | Get workspace by ID |
| PATCH | `/workspaces/:id` | Update workspace (OWNER only) |
| DELETE | `/workspaces/:id` | Delete workspace (OWNER only) |

### Note Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/notes` | Create note |
| GET | `/notes/:id` | Get note by ID |
| PATCH | `/notes/:id` | Update note |
| DELETE | `/notes/:id` | Delete note (OWNER only) |
| GET | `/notes/workspace/:workspaceId?q=search` | List workspace notes with search |
| GET | `/notes/public?q=search&sort=new` | Public directory (sort: new/old/upvotes/downvotes) |

### Vote Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/votes` | Create/update vote (up/down) |
| GET | `/votes/note/:noteId` | Get votes for a note |
| DELETE | `/votes/note/:noteId` | Delete user's vote |

### History Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/history/note/:noteId` | Get note history (last 7 days) |
| GET | `/history/:id` | Get specific history entry |
| POST | `/notes/:id/history/:historyId/restore` | Restore note from history |

---

## 🏗️ Project Structure

```
workspace-notes-backend/
├── src/
│   ├── app.ts                    # Express app setup
│   ├── server.ts                 # Server entry point
│   ├── config/
│   │   ├── env.ts               # Environment variables
│   │   └── passport.ts          # Passport configuration
│   ├── database/                # Database connection
│   ├── middleware/
│   │   ├── checkAuth.ts         # Authentication middleware
│   │   ├── validateRequest.ts   # Zod validation
│   │   ├── globalErrorHandler.ts
│   │   └── queryPerformance.ts  # Performance monitoring
│   ├── modules/
│   │   ├── auth/                # Authentication
│   │   ├── company/             # Company management
│   │   ├── user/                # User management
│   │   ├── workspace/           # Workspace CRUD
│   │   ├── note/                # Note CRUD
│   │   ├── vote/                # Voting system
│   │   └── noteHistory/         # Version history
│   ├── jobs/
│   │   └── historyRetention.ts  # Cleanup old history (7-day retention)
│   ├── scripts/
│   │   └── seedLarge.ts         # Database seeder
│   ├── utils/
│   │   ├── jwt.ts               # JWT utilities
│   │   ├── hash.ts              # Password hashing
│   │   ├── cloudinary.ts        # File uploads
│   │   └── queryBuilder.ts      # Query helpers
│   └── routes/
│       └── index.ts             # Route aggregation
├── .env                          # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🗄️ Database Schema

### Collections

1. **companies** - Multi-tenant isolation
2. **users** - Authentication with roles (OWNER/MEMBER)
3. **workspaces** - Note organization
4. **notes** - Core content with public/private visibility
5. **votes** - Voting on public notes
6. **notehistories** - Version history (7-day retention)

### Key Relationships

```
Company (1) ──┬──> (N) Users
              ├──> (N) Workspaces
              └──> (N) Notes

User (1) ──┬──> (N) Workspaces (as creator)
           ├──> (N) Notes (as author)
           └──> (N) Votes

Workspace (1) ──> (N) Notes

Note (1) ──┬──> (N) NoteHistory
           └──> (N) Votes
```

---

## 🔒 Authentication Flow

### 1. Registration

- **New Company**: User provides `companyName`, creates company with email domain
- **Existing Company**: User with same email domain auto-joins as MEMBER
- First user becomes OWNER

### 2. Login

- Email/password authentication
- JWT token in httpOnly cookie
- User role and company context in token

### 3. Authorization

- **OWNER**: Full CRUD on workspaces, notes, company data
- **MEMBER**: Read-only access to company resources

---

## ⚡ Performance Monitoring

The backend includes built-in performance monitoring:

```bash
# You'll see in console:
⚡ GET /api/v1/notes/public - 234ms - Memory: 2.5MB
📊 MongoDB Query:
   Collection: notes
   Method: find
   Query: { "type": "public", "isDraft": false }
⚠️  SLOW QUERY ALERT: GET /api/v1/notes/public took 1523ms
```

To disable MongoDB query logging in production, set:
```env
NODE_ENV=production
```

---

## 🧹 Maintenance

### Automatic Jobs

- **History Retention**: Runs daily at 2 AM to delete notes older than 7 days

### Manual Cleanup

Drop votes collection (if schema changes):
```bash
# MongoDB shell
use workspace-notes
db.votes.drop()
```

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution**: Check `DB_URL` in `.env` and ensure MongoDB is running

### Issue: "JWT secret not configured"
**Solution**: Set `JWT_ACCESS_SECRET` in `.env`

### Issue: "User already exists"
**Solution**: Each email can only register once globally

### Issue: "Duplicate vote error with voterCompanyId"
**Solution**: Drop votes collection: `db.votes.drop()` and restart server

### Issue: "Cannot login with seeded data"
**Solution**: Ensure you ran the seeder after updating the schema with domains

---

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build TypeScript to JavaScript |
| `npm run seed:large` | Seed database with test data |
| `npm test` | Run tests (not configured yet) |

---

## 🚢 Deployment

### Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Add environment variables in Vercel dashboard
4. Deploy: `vercel --prod`

### Railway / Render

1. Connect GitHub repository
2. Set environment variables
3. Set build command: `npm run build`
4. Set start command: `node dist/server.js`

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-domain.com
DB_URL=mongodb+srv://...
JWT_ACCESS_SECRET=super-secure-random-secret-key-here
JWT_ACCESS_EXPIRES_IN=7d
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👥 Support

For issues and questions:
- Create an issue in the repository
- Contact: [your-email@example.com]

---

## 🎉 Quick Start Summary

```bash
# 1. Clone and install
git clone <repo-url> && cd workspace-notes-backend
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your values

# 3. Seed database (optional)
npm run seed:large

# 4. Start server
npm run dev

# 5. Test login
# Email: owner@company1.com
# Password: Password1!
```

**Server running at**: `http://localhost:5000` 🚀

---

Made with ❤️ for collaborative note-taking
