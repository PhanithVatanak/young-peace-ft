# Backend API Documentation

## Overview
This application includes a MongoDB-based backend with user authentication and role-based access control (RBAC) for managing players and users.

## Database Models

### User Model
- **Fields**: email, password, name, role, timestamps
- **Roles**: 
  - `user` - Regular user (default)
  - `admin` - Can manage players
  - `super_admin` - Full system access

### Player Model
- **Fields**: name, email, jerseyNumber, position, team, phone, dateOfBirth, height, weight, country, userId, timestamps
- **Positions**: Goalkeeper, Defender, Midfielder, Forward

## API Endpoints

### Authentication (`/api/auth`)

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}

Response:
{
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": { "id": "...", "email": "...", "name": "...", "role": "user" }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response:
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": { "id": "...", "email": "...", "name": "...", "role": "user" }
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>

Response:
{
  "_id": "...",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user"
}
```

### Players (`/api/players`)

#### Get All Players (Admin/Super Admin Only)
```
GET /api/players
Authorization: Bearer <admin-token>

Response:
[
  {
    "_id": "...",
    "name": "Cristiano Ronaldo",
    "jerseyNumber": 7,
    "position": "Forward",
    "team": "Manchester United",
    "email": "cristiano@example.com",
    "phone": "+1234567890",
    "height": 187,
    "weight": 84,
    "country": "Portugal"
  }
]
```

#### Get Player by ID
```
GET /api/players/:id
Authorization: Bearer <token>

Response:
{
  "_id": "...",
  "name": "Player Name",
  "jerseyNumber": 10,
  "position": "Midfielder",
  "team": "Team Name"
}
```

#### Create Player (Admin/Super Admin Only)
```
POST /api/players
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "New Player",
  "jerseyNumber": 11,
  "position": "Forward",
  "team": "Team Name",
  "email": "player@example.com",
  "phone": "+1234567890",
  "dateOfBirth": "2000-01-15",
  "height": 180,
  "weight": 75,
  "country": "Country Name"
}

Response:
{
  "message": "Player created successfully",
  "player": { "..." }
}
```

#### Update Player (Admin/Super Admin Only)
```
PUT /api/players/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "jerseyNumber": 12,
  "position": "Midfielder"
}

Response:
{
  "message": "Player updated successfully",
  "player": { "..." }
}
```

#### Delete Player (Super Admin Only)
```
DELETE /api/players/:id
Authorization: Bearer <super-admin-token>

Response:
{
  "message": "Player deleted successfully"
}
```

### Users (`/api/users`)

#### Get All Users (Super Admin Only)
```
GET /api/users
Authorization: Bearer <super-admin-token>

Response:
[
  {
    "_id": "...",
    "email": "user@example.com",
    "name": "User Name",
    "role": "user"
  }
]
```

#### Get User by ID (Super Admin or Own Profile)
```
GET /api/users/:id
Authorization: Bearer <token>

Response:
{
  "_id": "...",
  "email": "user@example.com",
  "name": "User Name",
  "role": "user"
}
```

#### Update User Role (Super Admin Only)
```
PATCH /api/users/:id/role
Authorization: Bearer <super-admin-token>
Content-Type: application/json

{
  "role": "admin"
}

Response:
{
  "message": "User role updated successfully",
  "user": { "..." }
}
```

#### Delete User (Super Admin Only)
```
DELETE /api/users/:id
Authorization: Bearer <super-admin-token>

Response:
{
  "message": "User deleted successfully"
}
```

## Setup Instructions

### Local Development

1. **Install Dependencies**
```bash
npm install
```

2. **Set Environment Variables**
Create `.env.local`:
```
MONGODB_URI=mongodb://localhost:27017/young-peace-ft
JWT_SECRET=your-secret-key
```

3. **Start MongoDB** (if using locally)
```bash
mongod
```

4. **Run Development Server**
```bash
npm run dev
```

### Vercel Deployment

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create a free cluster
   - Get your connection string

2. **Install Vercel CLI**
```bash
npm install -g vercel
```

3. **Link to Vercel**
```bash
vercel link
```

4. **Set Environment Variables in Vercel**
```bash
vercel env add MONGODB_URI
vercel env add JWT_SECRET
```

5. **Deploy**
```bash
vercel deploy --prod
```

## Authentication

All protected endpoints require a Bearer token in the `Authorization` header:
```
Authorization: Bearer <your-jwt-token>
```

Tokens expire after 7 days. Users must login again to get a new token.

## Role-Based Access Control

| Endpoint | User | Admin | Super Admin |
|----------|------|-------|------------|
| GET /api/players | ✗ | ✓ | ✓ |
| GET /api/players/:id | ✓ | ✓ | ✓ |
| POST /api/players | ✗ | ✓ | ✓ |
| PUT /api/players/:id | ✗ | ✓ | ✓ |
| DELETE /api/players/:id | ✗ | ✗ | ✓ |
| GET /api/users | ✗ | ✗ | ✓ |
| PATCH /api/users/:id/role | ✗ | ✗ | ✓ |
| DELETE /api/users/:id | ✗ | ✗ | ✓ |

## Error Responses

```json
{
  "message": "Error description",
  "error": "Error details"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error
