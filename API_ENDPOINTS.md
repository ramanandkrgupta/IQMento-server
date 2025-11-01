# Alumni Booking Platform - API Endpoints Implementation

This document outlines all the API endpoints implemented for the Alumni Booking Platform.

## Implemented Endpoints

### 1. Alumni with Booking Functionality
**GET** `/api/alumni/bookable`

Fetch alumni who have call booking enabled (either `isBookable: true` or `accept_meets: true`).

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "userId": {...},
      "college": {...},
      "availabilities": [...],
      "isBookable": true,
      ...
    }
  ],
  "meta": {...}
}
```

---

### 2. Featured Colleges
**GET** `/api/colleges/featured`

Get curated list of featured colleges where `isFeatured: true`.

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "College Name",
      "coverImage": {...},
      "alumnis": [...],
      ...
    }
  ],
  "meta": {...}
}
```

---

### 3. All Colleges (with Pagination and Search)
**GET** `/api/colleges`

Retrieve complete list of colleges with optional pagination and search.

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Results per page (default: 10)
- `search` (optional) - Search in college names, descriptions, and locations

**Example:** `/api/colleges?page=1&limit=20&search=engineering`

**Response:**
```json
{
  "data": [...],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "pageCount": 5,
      "total": 100
    }
  }
}
```

---

### 4. Individual College Page
**GET** `/api/colleges/:college_id`

Get detailed college information including alumni list and statistics.

**Response:**
```json
{
  "data": {
    "id": 1,
    "name": "College Name",
    "coverImage": {...},
    "collegePhotos": [...],
    "alumnis": [...],
    "stats": {
      "totalAlumni": 50,
      "bookableAlumni": 25
    },
    ...
  }
}
```

---

### 5. Individual Alumni Page
**GET** `/api/alumni/:alumni_id`

Get full alumni profile with booking details and availability.

**Response:**
```json
{
  "data": {
    "id": 1,
    "userId": {...},
    "college": {...},
    "availabilities": [...],
    "bookings": [...],
    ...
  }
}
```

---

### 6. Authentication

#### Login
**POST** `/api/login`

Authenticate a user and return JWT token.

**Request Body:**
```json
{
  "identifier": "user@example.com",  // email or username
  "password": "password123"
}
```

**Response:**
```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "user@example.com",
    ...
  }
}
```

#### Register
**POST** `/api/register`

Register a new user.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "user@example.com",
    ...
  }
}
```

---

### 7. Book a Call
**POST** `/api/bookings`

Create a new booking with an alumnus. Requires authentication.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "alumniId": 1,
  "meetingTime": "2024-12-01T10:00:00Z",
  "durationInMin": 30,
  "callType": "audio",  // or "video"
  "meetLink": "https://meet.google.com/abc-defg-hij"  // optional
}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "meetingId": "MT1234567890123",
    "alumni": {...},
    "userId": {...},
    "meetingTime": "2024-12-01T10:00:00Z",
    "durationInMin": 30,
    "currentStatus": "upcoming",
    ...
  },
  "message": "Booking created successfully"
}
```

---

## Schema Enhancements

### User Schema
Enhanced with mentor-related fields:
- `phone` (unique)
- `phoneIsVerified`
- `emailIsVerified`
- `bio`
- `description`
- `designation`
- `birthday`
- `location`
- `expertise` (JSON array)
- `isMentor` (boolean)
- `audioCallPrice` (integer, price in paise)
- `videoCallPrice` (integer, price in paise)
- `rating` (decimal)
- `totalEarnings` (integer)
- `totalSessions` (integer)
- `totalUsersConnected` (integer)

### Alumni Schema
Enhanced with additional fields:
- `course`
- `graduationYear`
- `currentCompany`
- `currentJobRole`
- `jobLocation`
- `mobileNumber`
- `mail` (email)
- `profile`
- `isBookable` (boolean)
- `isFeatured` (boolean)

### College Schema
Enhanced with:
- `isFeatured` (boolean)
- `address`
- `mapLink`
- `university`

---

## Notes

1. All endpoints follow Strapi's REST API conventions
2. Authentication endpoints wrap Strapi's built-in `users-permissions` plugin
3. The bookings endpoint automatically generates a unique meeting ID in the format `MT{timestamp}{random}`
4. All endpoints return consistent error responses with appropriate HTTP status codes
5. Pagination and search are implemented for the colleges list endpoint
6. Stats are calculated dynamically for individual college pages

---

## Testing

To test the endpoints:
1. Start the Strapi server: `npm run develop`
2. Access the API at `http://localhost:1337/api`
3. Use the Strapi admin panel to manage content and set `isFeatured`, `isBookable` flags
4. Use tools like Postman or curl to test the endpoints

