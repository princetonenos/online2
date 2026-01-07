# GCO Backend API

Production-ready Node.js/Express backend for the Google Classroom Clone (GCO) application.

## 🚀 Features

- ✅ **RESTful API** with Express.js
- ✅ **PostgreSQL Database** with Prisma ORM
- ✅ **JWT Authentication** with refresh tokens
- ✅ **Real-time Updates** with Socket.IO
- ✅ **Redis Caching** for performance
- ✅ **File Storage** integration (DigitalOcean Spaces/S3)
- ✅ **Rate Limiting** to prevent abuse
- ✅ **Comprehensive Logging** with Winston
- ✅ **API Documentation** with Swagger
- ✅ **Security** with Helmet.js and CORS

## 📋 Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 15
- Redis >= 6.0
- npm >= 9.0.0

## 🛠️ Installation

1. **Install dependencies**:
```bash
cd backend
npm install
```

2. **Setup environment variables**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Setup database**:
```bash
# Run Prisma migrations
npm run db:push

# Generate Prisma client
npx prisma generate

# Seed database (optional)
npm run db:seed
```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```
Server will start on `http://localhost:8080`

### Production Mode
```bash
npm start
```

## 📚 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with nodemon |
| `npm start` | Start production server |
| `npm run db:migrate` | Run database migrations |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio (database GUI) |
| `npm test` | Run tests |
| `npm run lint` | Lint code |
| `npm run format` | Format code with Prettier |

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/      # Business logic
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   ├── services/        # Business services
│   └── server.js        # Express app entry point
├── prisma/
│   └── schema.prisma    # Database schema
├── logs/                # Application logs
├── .env.example         # Environment variables template
├── package.json
└── README.md
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Login**: POST `/api/v1/auth/login`
2. **Receive tokens**: Access token (15 min) + Refresh token (7 days)
3. **Use access token**: Include in `Authorization: Bearer <token>` header
4. **Refresh token**: POST `/api/v1/auth/refresh-token` when access token expires

## 📡 API Endpoints

### Authentication
```
POST   /api/v1/auth/register         Register new user
POST   /api/v1/auth/login            Login
POST   /api/v1/auth/logout           Logout
POST   /api/v1/auth/refresh-token    Refresh access token
```

### Users
```
GET    /api/v1/users                 Get all users (admin)
GET    /api/v1/users/:id             Get user by ID
PUT    /api/v1/users/:id             Update user
DELETE /api/v1/users/:id             Delete user
```

### Classes
```
GET    /api/v1/classes               Get user's classes
POST   /api/v1/classes               Create class
GET    /api/v1/classes/:id           Get class details
PUT    /api/v1/classes/:id           Update class
DELETE /api/v1/classes/:id           Delete class
POST   /api/v1/classes/:id/join      Join class (student)
```

### Assignments
```
GET    /api/v1/assignments           Get assignments
POST   /api/v1/assignments           Create assignment
GET    /api/v1/assignments/:id       Get assignment
PUT    /api/v1/assignments/:id       Update assignment
DELETE /api/v1/assignments/:id       Delete assignment
```

**Full API documentation available at**: `http://localhost:8080/api-docs` (development mode)

## 🔌 WebSocket Events

### Client → Server
- `join:class` - Join a class room
- `leave:class` - Leave a class room
- `typing:start` - Start typing indicator
- `typing:stop` - Stop typing indicator

### Server → Client
- `notification:new` - New notification
- `post:created` - New post in class
- `comment:added` - New comment on post
- `assignment:created` - New assignment
- `submission:graded` - Assignment graded

## 🗄️ Database Schema

### Core Tables
- **users** - User accounts and profiles
- **schools** - School/organization information
- **classes** - Class/course information
- **enrollments** - User-class relationships
- **assignments** - Assignment information
- **submissions** - Student submissions
- **posts** - Stream posts/announcements
- **comments** - Comments on posts
- **sessions** - Live class sessions
- **attendance** - Attendance records
- **notifications** - User notifications
- **files** - File metadata
- **refresh_tokens** - JWT refresh tokens

## 🔒 Security

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Tokens**: Short-lived access tokens + refresh tokens
- **Rate Limiting**: 100 requests per 15 minutes
- **CORS**: Configured for frontend domain
- **Helmet.js**: Security headers
- **Input Validation**: express-validator
- **SQL Injection**: Protected by Prisma ORM

##⚡ Performance

- **Redis Caching**: Frequently accessed data
- **Connection Pooling**: Efficient database connections
- **Compression**: gzip compression for responses
- **Pagination**: All list endpoints support pagination

## 📊 Monitoring & Logging

- **Winston Logger**: Structured logging
- **Log Levels**: error, warn, info, debug
- **Log Files**: 
  - `logs/error.log` - Error logs only
  - `logs/combined.log` - All logs
- **Console Output**: Colored logs in development

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## 🚀 Deployment

See the main [BACKEND_IMPLEMENTATION_GUIDE.md](../BACKEND_IMPLEMENTATION_GUIDE.md) for detailed deployment instructions to DigitalOcean.

### Quick Deploy Steps:
1. Setup DigitalOcean account
2. Create managed PostgreSQL database
3. Create Redis cluster
4. Setup Spaces for file storage
5. Deploy to App Platform
6. Configure environment variables
7. Run migrations

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check Prisma connection
npx prisma db pull

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

### Redis Connection Issues
```bash
# Test Redis connection
redis-cli ping
# Should return: PONG
```

### Port Already in Use
```bash
# Change PORT in .env file
PORT=8081
```

## 📝 Environment Variables

See `.env.example` for all available environment variables.

**Critical Variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - Secret for JWT signing
- `JWT_REFRESH_SECRET` - Secret for refresh tokens
- `FRONTEND_URL` - Frontend URL for CORS
- `SPACES_KEY` & `SPACES_SECRET` - DigitalOcean Spaces credentials

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Run tests and linting
4. Submit pull request

## 📄 License

MIT

## 📞 Support

For issues and questions, refer to:
- Main documentation: `BACKEND_IMPLEMENTATION_GUIDE.md`
- API documentation: `http://localhost:8080/api-docs`
- Prisma docs: https://www.prisma.io/docs

---

**Version**: 1.0.0  
**Last Updated**: November 2025
