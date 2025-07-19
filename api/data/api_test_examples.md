# Postly API Test Data Examples

This document contains JSON examples for testing all the endpoints in the Postly API. Use these examples with tools like Postman, curl, or any HTTP client.

## Base URL
```
http://localhost:8001
```

## Authentication Endpoints

### 1. User Signup
**Endpoint:** `POST /auth/signup`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "securePassword123!",
  "birthday": "1990-05-15T00:00:00"
}
```

**Example Response:**
```json
{
  "id": "user_123456789",
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "creationDate": "2025-07-19T10:30:00",
  "birthday": "1990-05-15T00:00:00"
}
```

### 2. User Signin
**Endpoint:** `POST /auth/signin`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123!"
}
```

**Example Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### 3. Get Current User Info
**Endpoint:** `GET /auth/me`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Example Response:**
```json
{
  "id": "user_123456789",
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "creationDate": "2025-07-19T10:30:00",
  "birthday": "1990-05-15T00:00:00"
}
```

## Posts Endpoints

### 4. Create Post
**Endpoint:** `POST /posts`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "text": "This is my first post on Postly! 🚀 #excited #newbeginning"
}
```

**Example Response:**
```json
{
  "id": "post_987654321",
  "userId": "user_123456789",
  "text": "This is my first post on Postly! 🚀 #excited #newbeginning",
  "blobUrl": null,
  "createdAt": "2025-07-19T11:15:00",
  "owner": {
    "id": "user_123456789",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "creationDate": "2025-07-19T10:30:00",
    "birthday": "1990-05-15T00:00:00"
  }
}
```

### 5. Get All Posts
**Endpoint:** `GET /posts`

**Query Parameters:**
- `skip`: 0 (optional, default: 0)
- `limit`: 10 (optional, default: 10)

**Example URL:** `GET /posts?skip=0&limit=5`

**Example Response:**
```json
[
  {
    "id": "post_987654321",
    "userId": "user_123456789",
    "text": "This is my first post on Postly! 🚀 #excited #newbeginning",
    "blobUrl": null,
    "createdAt": "2025-07-19T11:15:00"
  },
  {
    "id": "post_987654322",
    "userId": "user_123456789",
    "text": "Beautiful sunset today! 🌅 #nature #photography",
    "blobUrl": "https://example.com/blob/sunset.jpg",
    "createdAt": "2025-07-19T12:30:00"
  }
]
```

### 6. Get Single Post
**Endpoint:** `GET /posts/{post_id}`

**Example URL:** `GET /posts/post_987654321`

**Example Response:**
```json
{
  "id": "post_987654321",
  "userId": "user_123456789",
  "text": "This is my first post on Postly! 🚀 #excited #newbeginning",
  "blobUrl": null,
  "createdAt": "2025-07-19T11:15:00",
  "owner": {
    "id": "user_123456789",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "creationDate": "2025-07-19T10:30:00",
    "birthday": "1990-05-15T00:00:00"
  }
}
```

### 7. Update Post
**Endpoint:** `PUT /posts/{post_id}`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Example URL:** `PUT /posts/post_987654321`

**Request Body:**
```json
{
  "text": "Updated: This is my first post on Postly! 🚀 #excited #newbeginning #updated"
}
```

**Example Response:**
```json
{
  "id": "post_987654321",
  "userId": "user_123456789",
  "text": "Updated: This is my first post on Postly! 🚀 #excited #newbeginning #updated",
  "blobUrl": null,
  "createdAt": "2025-07-19T11:15:00",
  "owner": {
    "id": "user_123456789",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "creationDate": "2025-07-19T10:30:00",
    "birthday": "1990-05-15T00:00:00"
  }
}
```

### 8. Delete Post
**Endpoint:** `DELETE /posts/{post_id}`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Example URL:** `DELETE /posts/post_987654321`

**Example Response:**
```json
{
  "message": "Post deleted successfully"
}
```

### 9. Upload Media to Post
**Endpoint:** `POST /posts/{post_id}/upload`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data
```

**Example URL:** `POST /posts/post_987654321/upload`

**Form Data:**
- `file`: [Upload an image file like .jpg, .png, .gif]

**Example Response:**
```json
{
  "message": "Media uploaded successfully",
  "blobUrl": "https://example.com/blob/uploaded_image.jpg"
}
```

## Test Scenarios

### Scenario 1: Complete User Journey
1. **Sign up a new user** (POST /auth/signup)
2. **Sign in with the user** (POST /auth/signin)
3. **Get user info** (GET /auth/me)
4. **Create a post** (POST /posts)
5. **Get all posts** (GET /posts)
6. **Update the post** (PUT /posts/{post_id})
7. **Upload media to post** (POST /posts/{post_id}/upload)
8. **Get the specific post** (GET /posts/{post_id})
9. **Delete the post** (DELETE /posts/{post_id})

### Scenario 2: Multiple Users and Posts
```json
// User 1 Signup
{
  "email": "alice.smith@example.com",
  "firstName": "Alice",
  "lastName": "Smith",
  "password": "alicePassword123!",
  "birthday": "1985-08-22T00:00:00"
}

// User 2 Signup
{
  "email": "bob.johnson@example.com",
  "firstName": "Bob",
  "lastName": "Johnson",
  "password": "bobPassword456!",
  "birthday": "1992-12-03T00:00:00"
}

// Alice's Post
{
  "text": "Hello from Alice! 👋 Just joined Postly and loving it already! #newuser #excited"
}

// Bob's Post
{
  "text": "Bob here! 🎉 Ready to share my thoughts and connect with everyone. #introduction #community"
}
```

### Scenario 3: Error Testing

#### Invalid Signup Data
```json
{
  "email": "invalid-email",
  "firstName": "",
  "lastName": "Doe",
  "password": "123",
  "birthday": "invalid-date"
}
```

#### Invalid Login
```json
{
  "email": "nonexistent@example.com",
  "password": "wrongPassword"
}
```

#### Empty Post
```json
{
  "text": ""
}
```

## Additional Test Data Examples

### Sample Users for Testing
```json
[
  {
    "email": "sarah.wilson@example.com",
    "firstName": "Sarah",
    "lastName": "Wilson",
    "password": "sarahPass789!",
    "birthday": "1988-03-14T00:00:00"
  },
  {
    "email": "mike.davis@example.com",
    "firstName": "Mike",
    "lastName": "Davis",
    "password": "mikeSecure2023!",
    "birthday": "1995-11-28T00:00:00"
  },
  {
    "email": "emma.brown@example.com",
    "firstName": "Emma",
    "lastName": "Brown",
    "password": "emmaStrong456!",
    "birthday": "1993-07-09T00:00:00"
  }
]
```

### Sample Posts for Testing
```json
[
  {
    "text": "Just had an amazing coffee this morning! ☕ #coffee #goodmorning #blessed"
  },
  {
    "text": "Working on some exciting new projects today! 💻 #coding #developer #productivity"
  },
  {
    "text": "Beautiful weather for a walk in the park! 🌳🚶‍♀️ #nature #exercise #wellness"
  },
  {
    "text": "Finished reading an incredible book today! 📚 Highly recommend 'The Alchemist' #reading #books #inspiration"
  },
  {
    "text": "Cooking pasta for dinner tonight! 🍝 Nothing beats homemade food #cooking #pasta #homemade"
  }
]
```

## cURL Examples

### Signup with cURL
```bash
curl -X POST "http://localhost:8001/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "password": "testPassword123!",
    "birthday": "1990-01-01T00:00:00"
  }'
```

### Login with cURL
```bash
curl -X POST "http://localhost:8001/auth/signin" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testPassword123!"
  }'
```

### Create Post with cURL
```bash
curl -X POST "http://localhost:8001/posts" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "text": "This is a test post created with cURL! #test #api"
  }'
```

### Get Posts with cURL
```bash
curl -X GET "http://localhost:8001/posts?skip=0&limit=10"
```

## Notes
- Replace `YOUR_TOKEN_HERE` with the actual JWT token received from the signin endpoint
- All datetime fields should be in ISO 8601 format
- The server runs on port 8001 (as configured in your run.py)
- All authenticated endpoints require the `Authorization: Bearer <token>` header
- File uploads should use `multipart/form-data` content type
