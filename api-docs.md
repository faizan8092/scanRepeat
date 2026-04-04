# QRBold API Documentation

Welcome to the QRBold API documentation. This document provides all the necessary information for frontend implementation, including detailed request payload structures, response shapes, authentication methods, and common workflows.

---

## 📋 Table of Contents

- [Base URL](#-base-url)
- [Authentication](#-authentication)
- [Global Response Format](#-global-response-format)
- [Endpoints](#%EF%B8%8F-endpoints)
  - [1. Authentication (`/auth`)](#1-authentication-auth)
  - [2. User Profile (`/users`)](#2-user-profile-users)
  - [3. Products (`/products`)](#3-products-products)
  - [4. QR Codes (`/qr`)](#4-qr-codes-qr)
  - [5. Scans & Analytics (`/scans` & `/analytics`)](#5-scans--analytics)
  - [6. Stripe & Billing (`/stripe`)](#6-stripe--billing-stripe)
  - [7. Uploads (`/upload`)](#7-uploads-upload)
  - [8. Dashboard (`/dashboard`)](#8-dashboard-dashboard)
  - [9. Public Resolver (`/p`)](#9-public-resolver-p)
- [Error Codes Reference](#-error-codes-reference)
- [Frontend Implementation Tips](#%EF%B8%8F-frontend-implementation-tips)

---

## 🚀 Base URL

All requests should be prefixed with the current API version base URL:

```text
http://localhost:5000/api/v1
```

---

## 🔐 Authentication

Most endpoints require authentication. QRBold uses **JWT Access Tokens** sent via the `Authorization` header.

### Header Format

```http
Authorization: Bearer <your_access_token>
```

Refresh tokens are handled via **HTTP-only cookies**, so you do not need to manually send them in headers for token refresh requests, but your HTTP client (e.g., Axios, Fetch) must include credentials (`withCredentials: true`).

---

## 📦 Global Response Format

All API responses follow a consistent, strongly-typed structure.

### ✅ Success Response Structure

```json
{
  "success": true,
  "message": "Human readable success message",
  "data": { ... }, // The actual payload (object, array, or null)
  "meta": { ... } // Pagination or extra metadata (optional)
}
```

### ❌ Error Response Structure

```json
{
  "success": false,
  "message": "Human readable error message",
  "errors": [ ... ], // Optional array of validation error messages
  "stack": "..." // Only present in development mode
}
```

---

## 🛠️ Endpoints

### 1. Authentication (`/auth`)

---

#### `POST /auth/register`

Register a new user account.

**Request Payload:**

```json
{
  "name": "John Doe",           // Optional, string (2-100 chars)
  "email": "user@example.com",  // Required, valid email
  "password": "Strong123!@#"    // Required, string (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
}
```

**Success Response:**

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "accessToken": "eyJhbG..."
  }
}
```

---

#### `POST /auth/login`

Authenticate a user with email and password.

**Request Payload:**

```json
{
  "email": "user@example.com", // Required, string
  "password": "Strong123!@#"   // Required, string
}
```

**Success Response:** Returns the same structure as `/auth/register`.

---

#### `POST /auth/logout`

Log out the user, clearing the refresh token cookie.

**Request Payload:** None.

**Success Response:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### `POST /auth/refresh`

Get a new access token using the refresh token stored in the HTTP-only cookie.

**Request Payload:** None.

**Success Response:**

```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "accessToken": "eyJhbG..."
  }
}
```

---

#### `POST /auth/forgot-password`

Send a password reset email to the user.

**Request Payload:**

```json
{
  "email": "user@example.com" // Required, valid email
}
```

**Success Response:**

```json
{
  "success": true,
  "message": "If the email is registered, a recovery link has been sent"
}
```

---

#### `POST /auth/reset-password`

Reset password using the securely generated token sent to the user's email.

**Request Payload:**

```json
{
  "token": "a1b2c3d4e5f6...", // Required, 64-character hex string
  "password": "NewStrong123!@#", // Required, valid strong password
  "confirmPassword": "NewStrong123!@#" // Required, must match password
}
```

**Success Response:**

```json
{
  "success": true,
  "message": "Password has been successfully reset"
}
```

---

### 2. User Profile (`/users`)

---

#### `GET /users/me`

Retrieve the current authenticated user's profile.

**Response:**

```json
{
  "success": true,
  "message": "Profile retrieved",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "name": "John Doe",
    "avatar": "https://cloudinary.com/...",
    "company": "Acme Corp",
    "role": "Software Engineer",
    "bio": "Building cool things.",
    "emailVerified": true,
    "plan": "free",
    "stripeCurrentPeriodEnd": null,
    "createdAt": "2024-03-20T10:00:00.000Z",
    "_count": { "products": 5 }
  }
}
```

---

#### `PUT /users/me`

Update the current user's profile information.

**Request Payload:** (All fields are optional)

```json
{
  "firstName": "John",       // string, max 50 chars
  "lastName": "Doe",         // string, max 50 chars
  "name": "John Doe",        // string, max 100 chars
  "avatar": "https://...",   // valid URL string or empty string
  "company": "Acme Corp",    // string, max 100 chars or empty string
  "role": "Developer",       // string, max 100 chars or empty string
  "bio": "Hello World"       // string, max 500 chars or empty string
}
```

**Success Response:** Returns updated profile object in `data` (same schema as `GET /users/me`).

---

#### `PUT /users/me/password`

Change the user's password while authenticated.

**Request Payload:**

```json
{
  "currentPassword": "OldPassword123!", // Required, string
  "newPassword": "NewStrong123!@#",     // Required, strong password format
  "confirmPassword": "NewStrong123!@#"  // Required, must match newPassword
}
```

**Success Response:**

```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

---

#### Active Sessions Management

- **`GET /users/me/sessions`**: List all active user sessions (device/IP info).
- **`DELETE /users/me/sessions`**: Revoke all sessions (log out everywhere).
- **`DELETE /users/me/sessions/:id`**: Revoke a specific session by its ID.

---

### 3. Products (`/products`)

All product endpoints require **Bearer token authentication**.

---

#### `GET /products`

List all products for the authenticated user, with search, filter, sort, and pagination.

**Query Parameters:**

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Items per page (max 100) |
| `status` | string | `all` | Filter by status: `all`, `published`, `draft`, `archived` |
| `search` | string | — | Search by product name or short code |
| `sortBy` | string | `createdAt` | Sort field: `createdAt`, `updatedAt`, `name` |
| `sortOrder` | string | `desc` | Sort direction: `asc`, `desc` |

**Response:**

```json
{
  "success": true,
  "message": "Products retrieved",
  "data": [
    {
      "id": "cuid",
      "name": "Whey Protein 2.0",
      "type": "page_builder",
      "status": "published",
      "thumbnail": "https://res.cloudinary.com/.../thumb.jpg",
      "shortCode": "abc123",
      "slug": null,
      "destinationUrl": null,
      "fileUrl": null,
      "fileType": null,
      "publicUrl": "http://localhost:3000/p/abc123",
      "totalScans": 240,
      "totalReviews": 3,
      "uniqueCountries": 3,
      "publishedAt": "2026-03-01T10:00:00.000Z",
      "createdAt": "2026-02-20T08:00:00.000Z",
      "updatedAt": "2026-03-01T10:00:00.000Z",
      "qrForeground": "#000000",
      "qrBackground": "#FFFFFF",
      "qrLogoUrl": null,
      "qrDotStyle": "square",
      "qrErrorLevel": "H",
      "qrLabelText": null,
      "qrMargin": 4,
      "_count": { "scans": 240, "reviews": 3 }
    }
  ],
  "meta": {
    "total": 3,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

#### `GET /products/counts`

Get product counts grouped by status, for rendering tab badges. Optionally pass `search` to match the current search filter.

**Query Parameters:**

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `search` | string | Optional. Matches the search filter applied in `GET /products`. |

**Response:**

```json
{
  "success": true,
  "message": "Product counts retrieved",
  "data": {
    "all": 3,
    "published": 2,
    "draft": 1,
    "archived": 0,
    "plan": "free",
    "planLimit": 3
  }
}
```

> [!NOTE]
> `planLimit` will reflect the maximum number of products allowed for the user's current plan. `null` means unlimited. Plans: **free** = 3, **starter** = 25, **growth** = 100, **business** = 1000.

---

<details>
<summary><b>POST /products: Create New QR Product (Click to Expand)</b></summary>

#### `POST /products`

Create a new product.

**Request Payload:**

```json
{
  "name": "Campaign A",
  "type": "page_builder",
  "destinationUrl": "https://example.com",
  "fileUrl": "https://res.cloudinary.com/.../file.pdf",
  "fileType": "application/pdf"
}
```

| Field | Type | Required | Values |
| :--- | :--- | :--- | :--- |
| `name` | string | ✅ | 1–200 chars |
| `type` | string | — | `page_builder`, `file`, `external_url` (default: `page_builder`) |
| `destinationUrl` | string | — | Valid URL, used when `type` is `external_url` |
| `fileUrl` | string | — | Valid URL, used when `type` is `file` |
| `fileType` | string | — | MIME type e.g. `application/pdf` |

**Success Response:** Returns the created product object with `publicUrl`.

> **403 Error:** Returned if the user has already reached their plan's product limit.

</details>

---

#### `GET /products/:id`

Get detailed information for a specific product by ID. Includes `pageBlocks`, QR settings, `themeColors`, scan counts and unique countries.

---

#### `PUT /products/:id`

Update an existing product's settings and metadata.

**Request Payload:** (All fields are optional)

```json
{
  "name": "Updated Campaign",
  "status": "published",
  "thumbnail": "https://...",
  "themeColors": { "primary": "#3b82f6" },
  "destinationUrl": "https://...",
  "fileUrl": "https://...",
  "fileType": "application/pdf",
  "qrForeground": "#000000",
  "qrBackground": "#ffffff",
  "qrLogoUrl": "https://...",
  "qrDotStyle": "rounded",
  "qrErrorLevel": "M",
  "qrLabelText": "Scan Me",
  "qrMargin": 1
}
```

---

#### `PATCH /products/:id/rename`

Rename a product without altering any other fields.

**Request Payload:**

```json
{ "name": "New Product Name" }
```

**Response:**

```json
{
  "success": true,
  "message": "Product renamed",
  "data": { "id": "cuid", "name": "New Product Name", "updatedAt": "..." }
}
```

---

#### `POST /products/:id/publish`

Set product status to `published` and record `publishedAt` timestamp.

---

#### `POST /products/:id/unpublish`

Revert product status back to `draft`.

---

#### `POST /products/:id/archive`

Set product status to `archived`. Archived products are hidden from the `published` and `draft` tabs.

---

#### `POST /products/:id/unarchive`

Restore an archived product to `draft` status.

All status transition endpoints return the updated product object.

---

#### `POST /products/:id/duplicate`

Duplicate a product. The new copy will have `(Copy)` appended to the name and a new unique `shortCode`. Status is reset to `draft`.

> **403 Error:** Returned if the user has already reached their plan's product limit.

---

#### `DELETE /products/:id`

Permanently delete a product and all its associated scans, reviews, and ratings.

---

#### `PUT /products/:id/layout`

Unified endpoint to update a product's layout based on its type. Uses a strict **Discriminated Union** on the `type` field.

**Request Payload:**

<details>
<summary><b>Payload Examples by Product Type (Click to Expand)</b></summary>

##### If `type: "page_builder"`

```json
{
  "type": "page_builder",
  "themeColors": { "primary": "#1A1A2E", "background": "#FFFFFF" },
  "pageBlocks": [
    {
      "id": "uuid-1",
      "type": "heading",
      "data": { "text": "Premium Roast", "alignment": "center", "level": 1 }
    },
    {
      "id": "uuid-2",
      "type": "image",
      "data": { "url": "https://...", "alt": "Coffee" }
    }
  ]
}
```

##### If `type: "external_url"`

```json
{
  "type": "external_url",
  "destinationUrl": "https://shopify.com/store"
}
```

##### If `type: "file"`

```json
{
  "type": "file",
  "fileUrl": "https://...",
  "fileType": "application/pdf"
}
```

</details>

> [!IMPORTANT]
> When updating the layout, the backend automatically clears out fields from other types (e.g., if you switch from `file` to `external_url`, `fileUrl` will be set to `null`).

---

<details>
<summary><b>🧱 Deep Dive: Page Builder Implementation (Click to Expand)</b></summary>

To build a premium landing page editor/renderer, follow this data-structure guide. All blocks are sent in the `pageBlocks` array.

##### 1. Heading Block

```json
{
  "id": "block-1",
  "type": "heading",
  "data": {
    "text": "Get the New Coffee Blend!",
    "level": 1,
    "alignment": "center",
    "color": "#1A1A2E"
  }
}
```

##### 2. Text/Markdown Block

```json
{
  "id": "block-2",
  "type": "text",
  "data": {
    "content": "This coffee is **ethically sourced** from the highlands of Ethiopia.",
    "alignment": "left",
    "color": "#333333"
  }
}
```

##### 3. Image Block

```json
{
  "id": "block-3",
  "type": "image",
  "data": {
    "url": "https://res.cloudinary.com/demo/image/upload/coffee.jpg",
    "alt": "Coffee beans in a bag",
    "caption": "Freshly roasted daily",
    "aspectRatio": "16:9",
    "linkUrl": "https://coffee-shop.com/buy"
  }
}
```

##### 4. Video Block

```json
{
  "id": "block-4",
  "type": "video",
  "data": {
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "provider": "youtube",
    "autoplay": false,
    "muted": true,
    "loop": false
  }
}
```

##### 5. Action Button Block

```json
{
  "id": "block-5",
  "type": "button",
  "data": {
    "label": "Buy Now - $25",
    "url": "https://checkout.stripe.com/...",
    "style": "primary",
    "alignment": "full",
    "openInNewTab": true
  }
}
```

##### 6. Image Carousel Block

```json
{
  "id": "block-6",
  "type": "carousel",
  "data": {
    "images": [
      { "url": "https://...", "alt": "Slide 1" },
      { "url": "https://...", "alt": "Slide 2" }
    ],
    "autoPlay": true,
    "interval": 5,
    "showDots": true,
    "showArrows": true
  }
}
```

##### 7. Visual Divider Block

```json
{
  "id": "block-7",
  "type": "divider",
  "data": {
    "style": "dashed",
    "color": "#E5E7EB",
    "thickness": 2
  }
}
```

##### 8. Spacer (Layout Helper)

```json
{
  "id": "block-8",
  "type": "spacer",
  "data": {
    "height": 40
  }
}
```

##### 9. Product Reviews Block

```json
{
  "id": "block-9",
  "type": "reviews",
  "data": {
    "title": "What our customers are saying",
    "showAverage": true,
    "maxItems": 5
  }
}
```

##### 10. Link List (Socials/Tree)

```json
{
  "id": "block-10",
  "type": "link_list",
  "data": {
    "links": [
      { "label": "Instagram", "url": "https://instgr.am/...", "icon": "instagram" },
      { "label": "Website", "url": "https://mysite.com", "icon": "globe" }
    ]
  }
}
```

</details>

---

#### `GET /products/:id/blocks`

Get only the `pageBlocks` array for the page builder.

**Response:**

```json
{
  "success": true,
  "data": {
    "pageBlocks": [{ "type": "header", "content": "Welcome" }]
  }
}
```

---

#### `PUT /products/:id/blocks`

Update only the `pageBlocks` array of a product. (Prefer using `PUT /layout` for full control).

**Request Payload:**

```json
{
  "pageBlocks": [{ "type": "header", "content": "Welcome to my page" }]
}
```

---

### 4. QR Codes (`/qr`)

<details>
<summary><b>QR Code Customization & Management (Click to Expand)</b></summary>

---

#### `PUT /qr/:productId/customize`

Customize the styling options for the linked QR code.

**Request Payload:** (All fields are optional)

```json
{
  "qrForeground": "#000000",  // 6-char hex string
  "qrBackground": "#ffffff",  // 6-char hex string
  "qrLogoUrl": "https://...", // Valid URL
  "qrDotStyle": "rounded",    // enum: 'square', 'dots', 'rounded'
  "qrErrorLevel": "M",        // enum: 'L', 'M', 'Q', 'H'
  "qrLabelText": "Scan Me",   // String up to 100 characters
  "qrMargin": 4,              // Number between 0 and 20
  "width": 500                // Number to configure render size (min 100, max 2000)
}
```

</details>

---

### 5. Scans & Analytics (`/scans` & `/analytics`)

Handles public scanning log resolutions, and private analytics retrieval.

---

#### `GET /scans/resolve/:shortCode`

**Public endpoint**: Resolves a short code to its destination or page logic.

---

#### `POST /scans/log`

**Public endpoint**: Logs a scan event triggered by a user scanning a QR.

---

#### Analytics Endpoints (Requires Auth)

- **`GET /analytics/overview`**: Total stats across all products.
- **`GET /analytics/:productId/scans`**: Timeline of scans (30 days default).
- **`GET /analytics/:productId/devices`**: Aggregated device tracking.
- **`GET /analytics/:productId/countries`**: Aggregated location tracking.

---

### 6. Stripe & Billing (`/stripe`)

---

#### `POST /stripe/checkout`

Create a Stripe Checkout Session to upgrade a plan.

**Payload:**

```json
{
  "plan": "starter" // "starter" | "growth" | "business"
}
```

**Response:** Returns a `{ data: { url: "https://checkout.stripe.com/..." } }` object for the frontend to redirect the user to.

---

#### `POST /stripe/portal`

No payload. Creates a Stripe Customer Portal session link for the user to manage their active subscription.

---

### 7. Uploads (`/upload`)

Used to push files to Cloudinary or similar storage.

---

#### `POST /upload/image` & `POST /upload/file`

**Request Format:** `multipart/form-data`

**Key expected in FormData:** `file`

**Success Response:**

```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/.../abc.jpg",
    "publicId": "folder_path/abc"
  }
}
```

---

### 8. Dashboard (`/dashboard`)

Provide aggregated data to render the main user dashboard UI, including overview stats, scan activity timeline, recent products, and usage limits.

---

#### `GET /dashboard`

Retrieve dashboard data for the authenticated user.

**Response:**

```json
{
  "success": true,
  "message": "Dashboard data retrieved",
  "data": {
    "overview": {
      "totalScans": { "value": 12482, "trend": 12.5 },
      "activeProducts": { "value": 24, "trend": 0 },
      "directFunnels": { "value": 8241, "trend": 0 },
      "avgConversion": { "value": 10.4, "trend": 0.2 }
    },
    "scanActivity": [
      {
        "date": "Mar 12",
        "totalScans": 300,
        "uniqueVisitors": 220
      }
    ],
    "usageLimits": {
      "funnels": { "current": 24, "limit": 100 },
      "monthlyVolume": { "current": 12482, "limit": 50000 },
      "assets": { "current": 1.2, "limit": 5 }
    },
    "recentProducts": [
      {
        "id": "cuid",
        "name": "Whey Protein 2kg",
        "shortCode": "abc1234",
        "status": "active",
        "engagement": 1240,
        "conversion": 10.4
      }
    ]
  }
}
```

---

### 9. Public Resolver (`/p`)

**Public endpoint**: No authentication required. Used by the frontend to resolve a QR scan to its content.

---

#### `GET /p/:shortCode`

Look up a product by its unique short code.

**Response (Page Builder):**

```json
{
  "success": true,
  "data": {
    "type": "page_builder",
    "productId": "cuid",
    "name": "Single Origin Coffee",
    "thumbnail": "https://...",
    "themeColors": { "primary": "#1A1A2E" },
    "pageBlocks": [ ... ]
  }
}
```

**Response (Redirect/File):**

```json
{
  "success": true,
  "data": {
    "type": "external_url",
    "redirectUrl": "https://shopify.com/..."
  }
}
```

> [!WARNING]
> If the product status is anything other than `published`, this endpoint returns a `404 Not Found` with the message "Page not published".

---

## 🧪 Error Codes Reference

| HTTP Status | Meaning | Typical Reason |
| :--- | :--- | :--- |
| `400` | Bad Request | Missing required fields or malformed request payload. |
| `401` | Unauthorized | Missing or expired Bearer token. |
| `403` | Forbidden | Access denied (e.g., trying to modify another user's product). |
| `404` | Not Found | Resource does not exist (e.g., product deleted). |
| `409` | Conflict | Unique constraint violation (e.g., duplicate email during registration). |
| `422` | Unprocessable Entity | Schema Validation failed. Check the `errors` array in the response for field-specific problems. |
| `429` | Too Many Requests | Rate limit exceeded. Try again later. |
| `500` | Internal Server Error | Server-side crash or unhandled exception. |

---

## 🛠️ Frontend Implementation Tips

1. **Axios Interceptor Hooks:** Ensure you use interceptors to automatically append `Authorization: Bearer <token>` to outbound requests. Also configure them to elegantly handle `401` errors by hitting `/auth/refresh` behind the scenes, resolving the original request, and retrying.
2. **Handle Form Validation:** Endpoints like `/auth/register` and `/products/:id` return a `422` status and an `errors` array describing exactly which fields broke Zod's validation schema (e.g., "Password must contain at least one uppercase letter"). Mapping these errors gracefully to the UI is standard practice.
3. **Cross-Origin Credentials:** Make sure `withCredentials: true` is enabled in your fetching library so the `refreshToken` HTTP-only cookie is sent and set securely across origins.
4. **Pagination Optimization:** Use `page` and `limit` query parameters for endpoints that return arrays such as `/products` and `/scans/:productId`. Provide a "Load More" or robust Pagination control component referencing the `meta.total` response property.
5. **Handling Discriminated Unions:** The `/p/:shortCode` and `/products/:id/layout` endpoints use the Discriminated Union pattern. In TypeScript, use the `type` field to narrow down the data structure:

```typescript
if (product.type === 'page_builder') {
  renderBlocks(product.pageBlocks);
} else if (product.type === 'external_url') {
  window.location.href = product.redirectUrl;
}
```

1. **QR Scan Logic:** When a user scans a QR, the frontend should hit `GET /p/:shortCode`. If the response `type` is `external_url` or `file`, perform an immediate `window.location.replace(data.redirectUrl)`. If it's `page_builder`, render the landing page components.

---

*Generated by Antigravity AI assistant.*
