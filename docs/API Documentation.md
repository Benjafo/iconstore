# API Documentation - Icon Pack Store

## Base URL

```
https://api.iconstore.com/v1
```

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

---

## Authentication Endpoints

### Register User

```
POST /auth/register
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Response:**

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "username": "johndoe",
    "currency_balance": 0,
    "created_at": "2024-01-15T10:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Login

```
POST /auth/login
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "username": "johndoe",
    "currency_balance": 500
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Forgot Password

```
POST /auth/forgot-password
```

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "message": "Password reset email sent",
  "reset_token_expires_at": "2024-01-15T11:00:00Z"
}
```

### Reset Password

```
POST /auth/reset-password
```

**Request Body:**

```json
{
  "token": "reset-token-from-email",
  "new_password": "newsecurepassword123"
}
```

**Response:**

```json
{
  "message": "Password successfully reset",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "username": "johndoe"
  }
}
```

**Error Response (Invalid Token):**

```json
{
  "error": "invalid_token",
  "message": "Reset token is invalid or expired"
}
```

---

## User Endpoints

### Get Current User

```
GET /user/me
```

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "username": "johndoe",
  "currency_balance": 500,
  "created_at": "2024-01-15T10:00:00Z",
  "icons_owned": 15
}
```

### Get User's Owned Icons

```
GET /user/icons
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

**Response:**

```json
{
  "icons": [
    {
      "id": "icon-uuid-1",
      "name": "Fire Dragon",
      "file_url": "https://cdn.iconstore.com/icons/fire-dragon.png",
      "pack_name": "Fantasy Creatures",
      "unlocked_at": "2024-01-20T15:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "total_pages": 1
  }
}
```

---

## Currency Endpoints

### Get Currency Packages

```
GET /currency/packages
```

**Response:**

```json
{
  "packages": [
    {
      "id": "pkg-1",
      "name": "Starter Pack",
      "currency_amount": 100,
      "bonus_amount": 0,
      "price_cents": 99,
      "price_display": "$0.99"
    },
    {
      "id": "pkg-2",
      "name": "Value Pack",
      "currency_amount": 500,
      "bonus_amount": 50,
      "price_cents": 499,
      "price_display": "$4.99"
    }
  ]
}
```

### Purchase Currency

```
POST /currency/purchase
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "package_id": "pkg-2",
  "payment_method": "stripe",
  "payment_token": "tok_visa"
}
```

**Response:**

```json
{
  "transaction": {
    "id": "txn-123",
    "amount": 550,
    "new_balance": 1050,
    "created_at": "2024-01-20T16:00:00Z"
  },
  "receipt_url": "https://api.iconstore.com/receipts/txn-123"
}
```

### Get Transaction History

```
GET /currency/transactions
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

- `page` (optional): Page number
- `limit` (optional): Items per page
- `type` (optional): Filter by transaction type

**Response:**

```json
{
  "transactions": [
    {
      "id": "txn-1",
      "type": "purchase",
      "amount": -100,
      "balance_after": 950,
      "description": "Unlocked icon from Fantasy Creatures",
      "created_at": "2024-01-20T15:30:00Z"
    },
    {
      "id": "txn-2",
      "type": "currency_buy",
      "amount": 550,
      "balance_after": 1050,
      "description": "Purchased Value Pack",
      "created_at": "2024-01-20T16:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 2
  }
}
```

---

## Icon Pack Endpoints

### List Icon Packs

```
GET /packs
```

**Query Parameters:**

- `page` (optional): Page number
- `limit` (optional): Items per page
- `search` (optional): Search by name
- `sort` (optional): Sort by: `price_asc`, `price_desc`, `newest`, `popular`

**Response:**

```json
{
  "packs": [
    {
      "id": "pack-1",
      "name": "Fantasy Creatures",
      "description": "Mystical beasts and legendary creatures",
      "price": 100,
      "preview_icon_url": "https://cdn.iconstore.com/previews/fantasy.png",
      "total_icons": 25,
      "unlocked_count": 5,
      "is_complete": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 10
  }
}
```

### Get Pack Details

```
GET /packs/:pack_id
```

**Response:**

```json
{
  "id": "pack-1",
  "name": "Fantasy Creatures",
  "description": "Mystical beasts and legendary creatures",
  "price": 100,
  "preview_icon_url": "https://cdn.iconstore.com/previews/fantasy.png",
  "total_icons": 25,
  "unlocked_icons": [
    {
      "id": "icon-1",
      "name": "Fire Dragon",
      "file_url": "https://cdn.iconstore.com/icons/fire-dragon.png"
    }
  ],
  "locked_count": 20,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Purchase Random Icon from Pack

```
POST /packs/:pack_id/purchase
```

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "success": true,
  "unlocked_icon": {
    "id": "icon-5",
    "name": "Ice Phoenix",
    "file_url": "https://cdn.iconstore.com/icons/ice-phoenix.png",
    "rarity": 3
  },
  "purchase": {
    "id": "purchase-123",
    "price_paid": 100,
    "new_balance": 400,
    "transaction_id": "txn-456"
  }
}
```

**Error Response (Insufficient Balance):**

```json
{
  "error": "insufficient_balance",
  "message": "Not enough currency. Required: 100, Available: 50",
  "required": 100,
  "available": 50
}
```

**Error Response (All Icons Unlocked):**

```json
{
  "error": "pack_complete",
  "message": "All icons in this pack have been unlocked"
}
```

---

## Error Responses

All endpoints may return these standard error formats:

### 400 Bad Request

```json
{
  "error": "validation_error",
  "message": "Invalid request data",
  "details": {
    "email": "Invalid email format"
  }
}
```

### 401 Unauthorized

```json
{
  "error": "unauthorized",
  "message": "Invalid or expired token"
}
```

### 404 Not Found

```json
{
  "error": "not_found",
  "message": "Resource not found"
}
```

### 429 Rate Limited

```json
{
  "error": "rate_limited",
  "message": "Too many requests",
  "retry_after": 60
}
```

### 500 Internal Server Error

```json
{
  "error": "internal_error",
  "message": "An unexpected error occurred",
  "request_id": "req-123456"
}
```

---

## Rate Limiting

- Authentication endpoints: 10 requests per minute
- Purchase endpoints: 10 requests per minute
- Read endpoints: 100 requests per minute

Rate limit headers included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642338000
```
