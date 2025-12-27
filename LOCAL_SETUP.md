# Local Development Setup (Without Docker)

## Prerequisites

- Node.js 18+
- PostgreSQL 14+ (running on localhost:5432)
- npm

## Step 1: Setup Database

```bash
# Create database
createdb saas_db

# Create user (if needed)
createuser -P postgres  # password: postgres
```

Or use pgAdmin to create the database.

## Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
DB_HOST=localhost
DB_PORT=5432
DB_NAME=saas_db
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your_jwt_secret_key_min_32_chars_make_it_secure_2024
JWT_EXPIRES_IN=24h
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
EOF

# Run migrations and start server
npm start
```

The backend will automatically:

- Run database migrations
- Load seed data
- Start on http://localhost:5000

## Step 3: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will open at http://localhost:3000

## Login Credentials

**Demo Tenant Admin:**

- Subdomain: `demo`
- Email: `admin@demo.com`
- Password: `Demo@123`

**Super Admin:**

- Email: `superadmin@system.com`
- Password: `Admin@123`
- (Leave subdomain empty)

## Troubleshooting

### Database connection fails

- Make sure PostgreSQL is running: `pg_isready`
- Check credentials in `.env`
- Verify database exists: `psql -l`

### Migrations don't run

- Delete the database: `dropdb saas_db`
- Recreate: `createdb saas_db`
- Run backend again

### Port already in use

- Change PORT in backend `.env`
- Change PORT in frontend `package.json` (proxy or start command)

## API Endpoints

- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Current user
- `GET /api/tenants` - List tenants
- `GET /api/projects` - List projects
- `GET /api/tasks` - List tasks

See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for production deployment.
