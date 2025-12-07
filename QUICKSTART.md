# 🚀 Quick Start Guide

## Prerequisites
- Node.js 18+
- MongoDB running locally or connection string
- npm or yarn

## Setup

### 1. Install Dependencies
```bash
cd workspace-notes-backend
npm install
```

### 2. Environment Variables
Create `.env` file in root:
```env
NODE_ENV=development
PORT=5000
DB_URL=mongodb://localhost:27017/workspace-notes

JWT_ACCESS_SECRET=your-access-secret-here
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

FRONTEND_URL=http://localhost:3000
```

### 3. Start Server
```bash
npm run dev
```

Server runs at: `http://localhost:5000`

### 4. Seed Large Dataset (Optional)
```bash
npm run seed:large
```

This creates:
- 50 companies
- 4-9 users per company
- ~1,000 workspaces
- ~500,000 notes

**Test Credentials:**
- Email: `owner@company1.com`
- Password: `Password1!`

---

## 🧪 Test the API

### Option 1: Use REST Client (VS Code Extension)
1. Install "REST Client" extension
2. Open `test-api.http`
3. Click "Send Request" on each endpoint

### Option 2: Use Postman/Insomnia
Import endpoints from `test-api.http`

### Option 3: cURL Examples

#### Register
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Company",
    "name": "Test User",
    "email": "test@test.com",
    "password": "Password1!"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "Password1!"
  }'
```

#### Create Workspace (use accessToken from login)
```bash
curl -X POST http://localhost:5000/api/v1/workspaces \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Engineering",
    "description": "Main workspace"
  }'
```

---

## 📚 API Documentation

See `TEST_FLOW.md` for complete API documentation and examples.

See `IMPLEMENTATION_COMPLETE.md` for architecture details.

---

## 🔑 Key Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register (auto-creates company)
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/logout` - Logout

### Workspaces
- `POST /api/v1/workspaces` - Create (OWNER only)
- `GET /api/v1/workspaces/my` - My workspaces

### Notes
- `POST /api/v1/notes` - Create note
- `PATCH /api/v1/notes/:id` - Update (auto-creates history)
- `GET /api/v1/notes/public-directory` - Public notes
- `GET /api/v1/notes/workspace/:id` - Workspace notes

### Voting
- `POST /api/v1/votes` - Vote on public note
- `GET /api/v1/votes/note/:id` - Get votes

### History
- `GET /api/v1/history/note/:id` - Get history
- `POST /api/v1/notes/:id/history/:historyId/restore` - Restore

---

## 🎯 User Flow

1. **Register** → Company auto-created, you become OWNER
2. **Login** → Get JWT token with companyId
3. **Create Workspace** → Only OWNERs can create
4. **Create Note** → Start as draft
5. **Publish** → Set `type: "public"`, `isDraft: false`
6. **Vote** → Other users vote on public notes
7. **History** → Auto-saved on every update, 7-day retention

---

## 🔧 Development

### Build
```bash
npm run build
```

### Production
```bash
npm start
```

---

## ✅ Verification

After starting the server, verify:

1. Server is running: `http://localhost:5000`
2. No TypeScript errors: `npm run build`
3. Can register new user
4. Can create workspace (as OWNER)
5. Can create note
6. History created on note update
7. Votes work on public notes

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check MongoDB is running: `mongosh` or `mongo`
- Verify DB_URL in `.env`

### Port Already in Use
- Change PORT in `.env`
- Or kill process on port 5000

### TypeScript Errors
- Run `npm install` again
- Check `tsconfig.json` exists
- Clear `node_modules` and reinstall

---

## 📖 Next Steps

1. ✅ Backend complete and tested
2. 🔜 Build frontend UI
3. 🔜 Deploy to production

**Backend is 100% production-ready! 🎉**
