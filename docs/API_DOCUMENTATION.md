# LogiTrack API Documentation

**Base URL:** `http://localhost:8080/api`  
**Authorization:** JWT Bearer token in `Authorization` header  
**Content-Type:** `application/json`

---

## 🔐 Authentication Endpoints

### **Login**

```http
POST /api/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "driver",
  "password": "driver123"
}
```

**Success Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "DRIVER",
  "username": "driver"
}
```

**Error Response (401 Unauthorized):**
```json
"Invalid credentials"
```

**Error Response (403 Forbidden - Inactive):**
```json
"Your account has been deactivated. Please contact an administrator."
```

**Status Codes:**
- `200 OK` - Login successful
- `401 Unauthorized` - Invalid username/password
- `403 Forbidden` - Account is inactive
- `500 Internal Server Error` - Server error

---

### **Get Current User**

```http
GET /api/auth/me
Authorization: Bearer <JWT_TOKEN>
```

**Success Response (200 OK):**
```json
{
  "username": "driver",
  "role": "DRIVER",
  "email": "driver@logitrack.com",
  "fullName": "John Doe"
}
```

**Status Codes:**
- `200 OK` - User found
- `401 Unauthorized` - Token invalid/expired
- `404 Not Found` - User no longer exists

---

### **Verify API**

```http
GET /api/auth/verify
```

**Success Response (200 OK):**
```json
{
  "status": "API is working"
}
```

---

## 📦 Shipment Endpoints

### **Get All Shipments**

```http
GET /api/shipments
Authorization: Bearer <JWT_TOKEN>
```

**Permission:** ADMIN, MANAGER (not DRIVER - use `/my-shipments` instead)

**Query Parameters:**
```
?skip=0&limit=10&status=CREATED&driverId=2
```

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "trackingNumber": "TRK-12345",
    "deliveryAddress": "123 Main St",
    "status": "IN_TRANSIT",
    "driver": {
      "id": 2,
      "name": "John Doe",
      "licenseNumber": "LC-123456"
    },
    "manager": {
      "id": 1,
      "username": "admin",
      "fullName": "Admin User"
    },
    "length": 2.0,
    "width": 3.0,
    "height": 1.5,
    "distanceInMeters": 50.0,
    "costPerMeter": 10.0,
    "totalCost": 45000.0
  }
]
```

**Status Codes:**
- `200 OK` - Shipments retrieved
- `401 Unauthorized` - Token invalid
- `403 Forbidden` - Insufficient permissions

---

### **Get Driver's Assigned Shipments**

```http
GET /api/shipments/my-shipments
Authorization: Bearer <JWT_TOKEN>
```

**Permission:** DRIVER (automatically filters by current user's username)

**Success Response (200 OK):**
```json
[
  {
    "id": 3,
    "trackingNumber": "TRK-54321",
    "deliveryAddress": "456 Oak Ave",
    "status": "CREATED",
    "driver": {
      "id": 2,
      "name": "John Doe",
      "licenseNumber": "LC-123456"
    },
    "length": 1.5,
    "width": 2.0,
    "height": 1.0,
    "distanceInMeters": 30.0,
    "costPerMeter": 8.0,
    "totalCost": 60.0
  }
]
```

**Status Codes:**
- `200 OK` - Shipments retrieved
- `401 Unauthorized` - Token invalid
- `403 Forbidden` - Only drivers can access this endpoint

---

### **Get Shipment by ID**

```http
GET /api/shipments/{id}
Authorization: Bearer <JWT_TOKEN>
```

**Parameters:**
- `id` (path) - Shipment ID (number)

**Success Response (200 OK):**
```json
{
  "id": 1,
  "trackingNumber": "TRK-12345",
  "deliveryAddress": "123 Main St",
  "status": "DELIVERED",
  "driver": {...},
  "manager": {...},
  "totalCost": 45000.0
}
```

**Status Codes:**
- `200 OK` - Shipment found
- `404 Not Found` - Shipment doesn't exist
- `401 Unauthorized` - Token invalid

---

### **Get Shipment by Tracking Number**

```http
GET /api/shipments/tracking/{trackingNumber}
Authorization: Bearer <JWT_TOKEN>
```

**Parameters:**
- `trackingNumber` (path) - Tracking number in format TRK-XXXXX

**Success Response (200 OK):**
```json
{
  "id": 1,
  "trackingNumber": "TRK-12345",
  "deliveryAddress": "123 Main St",
  "status": "IN_TRANSIT"
}
```

**Status Codes:**
- `200 OK` - Shipment found
- `404 Not Found` - Tracking number not found
- `400 Bad Request` - Invalid tracking number format

---

### **Create Shipment**

```http
POST /api/shipments
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Permission:** ADMIN, MANAGER

**Request Body:**
```json
{
  "trackingNumber": "TRK-12345",
  "deliveryAddress": "123 Main St, New York, NY 10001",
  "status": "CREATED",
  "driver": {
    "id": 2
  },
  "manager": {
    "id": 1
  },
  "length": 2.5,
  "width": 3.0,
  "height": 1.8,
  "distanceInMeters": 100.0,
  "costPerMeter": 15.0
}
```

**Required Fields:**
- `trackingNumber` - Format: TRK-XXXXX (must be unique)
- `deliveryAddress` - Delivery location
- `driver` - { "id": driverId } (optional)
- `manager` - { "id": managerId } (optional)

**Calculated Field:**
- `totalCost` - Auto-calculated: (length × width × height) × distanceInMeters × costPerMeter

**Success Response (201 Created):**
```json
{
  "id": 5,
  "trackingNumber": "TRK-12345",
  "deliveryAddress": "123 Main St, New York, NY 10001",
  "status": "CREATED",
  "driver": {
    "id": 2,
    "name": "John Doe"
  },
  "manager": {
    "id": 1,
    "username": "admin"
  },
  "totalCost": 135000.0
}
```

**Error Response (400 Bad Request - Invalid Format):**
```json
"Invalid tracking number format. Tracking number must follow 'TRK-XXXXX' (e.g., TRK-12345)."
```

**Error Response (409 Conflict - Duplicate):**
```
HTTP 409 Conflict
"Tracking number already exists"
```

**Error Response (404 Not Found - Driver):**
```
HTTP 404 Not Found
"Driver not found!"
```

**Status Codes:**
- `201 Created` - Shipment created successfully
- `400 Bad Request` - Invalid data/format
- `409 Conflict` - Duplicate tracking number
- `404 Not Found` - Driver/Manager not found
- `401 Unauthorized` - Token invalid
- `403 Forbidden` - Insufficient permissions

---

### **Update Shipment**

```http
PUT /api/shipments/{id}
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Permission:** ADMIN, MANAGER

**Parameters:**
- `id` (path) - Shipment ID

**Request Body:**
```json
{
  "trackingNumber": "TRK-12345",
  "deliveryAddress": "456 Oak Ave, Boston, MA",
  "status": "IN_TRANSIT",
  "driver": {
    "id": 3
  },
  "manager": {
    "id": 1
  },
  "length": 2.5,
  "width": 3.0,
  "height": 1.8,
  "distanceInMeters": 150.0,
  "costPerMeter": 15.0
}
```

**Notes:**
- Tracking number cannot be changed (disabled in form)
- Driver can be changed/reassigned
- Costs are recalculated if dimensions provided
- Status can be changed

**Success Response (200 OK):**
```json
{
  "id": 1,
  "trackingNumber": "TRK-12345",
  "deliveryAddress": "456 Oak Ave, Boston, MA",
  "status": "IN_TRANSIT",
  "driver": {
    "id": 3,
    "name": "Jane Smith"
  },
  "totalCost": 202500.0
}
```

**Status Codes:**
- `200 OK` - Shipment updated
- `404 Not Found` - Shipment not found
- `409 Conflict` - New tracking number already used
- `401 Unauthorized` - Token invalid
- `403 Forbidden` - Insufficient permissions

---

### **Update Shipment Status (by Tracking Number)**

```http
PUT /api/shipments/track/{trackingNumber}
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Permission:** ADMIN, MANAGER, DRIVER

**Parameters:**
- `trackingNumber` (path) - Tracking number in format TRK-XXXXX

**Request Body:**
```json
{
  "status": "DELIVERED"
}
```

**Valid Status Values:**
- `CREATED` - Initial state
- `IN_TRANSIT` - Driver is transporting
- `OUT_FOR_DELIVERY` - Out for delivery
- `DELIVERED` - Successfully delivered
- `FAILED` - Delivery failed

**Success Response (200 OK):**
```json
{
  "id": 1,
  "trackingNumber": "TRK-12345",
  "status": "DELIVERED"
}
```

**Status Codes:**
- `200 OK` - Status updated
- `404 Not Found` - Tracking number not found
- `401 Unauthorized` - Token invalid
- `403 Forbidden` - Insufficient permissions (driver can only set specific statuses)

---

### **Delete Shipment by ID**

```http
DELETE /api/shipments/{id}
Authorization: Bearer <JWT_TOKEN>
```

**Permission:** ADMIN only

**Parameters:**
- `id` (path) - Shipment ID

**Success Response (200 OK):**
```json
"Shipment with ID 5 has been successfully deleted. 🗑️"
```

**Status Codes:**
- `200 OK` - Shipment deleted
- `404 Not Found` - Shipment not found
- `401 Unauthorized` - Token invalid
- `403 Forbidden` - Only admins can delete

---

### **Delete Shipment by Tracking Number**

```http
DELETE /api/shipments/tracking/{trackingNumber}
Authorization: Bearer <JWT_TOKEN>
```

**Permission:** ADMIN only

**Parameters:**
- `trackingNumber` (path) - Tracking number in format TRK-XXXXX

**Success Response (200 OK):**
```json
"Shipment TRK-12345 successfully removed from system. 🗑️"
```

**Status Codes:**
- `200 OK` - Shipment deleted
- `404 Not Found` - Tracking number not found
- `401 Unauthorized` - Token invalid
- `403 Forbidden` - Only admins can delete

---

## 👥 Driver Endpoints

### **List All Drivers**

```http
GET /api/drivers
Authorization: Bearer <JWT_TOKEN>
```

**Permission:** ADMIN, MANAGER

**Success Response (200 OK):**
```json
[
  {
    "id": 2,
    "name": "John Doe",
    "licenseNumber": "LC-123456",
    "user": {
      "id": 3,
      "username": "driver",
      "email": "driver@logitrack.com",
      "active": true
    }
  },
  {
    "id": 3,
    "name": "Jane Smith",
    "licenseNumber": "LC-654321",
    "user": {
      "id": 4,
      "username": "driver2",
      "email": "driver2@logitrack.com",
      "active": true
    }
  }
]
```

**Status Codes:**
- `200 OK` - Drivers retrieved
- `401 Unauthorized` - Token invalid
- `403 Forbidden` - Insufficient permissions

---

### **Create Driver**

```http
POST /api/drivers
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Permission:** ADMIN, MANAGER

**Request Body:**
```json
{
  "name": "Bob Wilson",
  "licenseNumber": "LC-999888",
  "user": {
    "id": 5
  }
}
```

**Success Response (201 Created):**
```json
{
  "id": 4,
  "name": "Bob Wilson",
  "licenseNumber": "LC-999888",
  "user": {
    "id": 5,
    "username": "bob_driver"
  }
}
```

**Status Codes:**
- `201 Created` - Driver created
- `400 Bad Request` - Invalid data
- `404 Not Found` - User not found
- `401 Unauthorized` - Token invalid
- `403 Forbidden` - Insufficient permissions

---

## 👤 User Endpoints

### **List All Users**

```http
GET /api/admin/users
Authorization: Bearer <JWT_TOKEN>
```

**Permission:** ADMIN only

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "username": "admin",
    "email": "admin@logitrack.com",
    "fullName": "System Admin",
    "role": "ADMIN",
    "active": true,
    "phoneNumber": "555-0001"
  },
  {
    "id": 2,
    "username": "manager",
    "email": "manager@logitrack.com",
    "fullName": "Logistics Manager",
    "role": "MANAGER",
    "active": true,
    "phoneNumber": "555-0002"
  },
  {
    "id": 3,
    "username": "driver",
    "email": "driver@logitrack.com",
    "fullName": "John Doe",
    "role": "DRIVER",
    "active": false,
    "phoneNumber": "555-0003"
  }
]
```

**Status Codes:**
- `200 OK` - Users retrieved
- `401 Unauthorized` - Token invalid
- `403 Forbidden` - Only admins can access

---

### **Create User**

```http
POST /api/admin/users
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Permission:** ADMIN only

**Request Body:**
```json
{
  "username": "newdriver",
  "password": "SecurePass123!",
  "email": "newdriver@logitrack.com",
  "fullName": "New Driver",
  "role": "DRIVER",
  "phoneNumber": "555-9999"
}
```

**Success Response (201 Created):**
```json
{
  "id": 10,
  "username": "newdriver",
  "email": "newdriver@logitrack.com",
  "fullName": "New Driver",
  "role": "DRIVER",
  "active": true,
  "phoneNumber": "555-9999"
}
```

**Status Codes:**
- `201 Created` - User created
- `400 Bad Request` - Invalid data
- `409 Conflict` - Username/email already exists
- `401 Unauthorized` - Token invalid
- `403 Forbidden` - Only admins can create

---

### **Activate User**

```http
PATCH /api/users/{userId}/activate
Authorization: Bearer <JWT_TOKEN>
```

**Permission:** ADMIN only

**Parameters:**
- `userId` (path) - User ID

**Success Response (200 OK):**
```json
{
  "id": 3,
  "username": "driver",
  "active": true
}
```

**Status Codes:**
- `200 OK` - User activated
- `404 Not Found` - User not found
- `401 Unauthorized` - Token invalid
- `403 Forbidden` - Only admins can activate

---

### **Deactivate User**

```http
PATCH /api/users/{userId}/deactivate
Authorization: Bearer <JWT_TOKEN>
```

**Permission:** ADMIN only

**Parameters:**
- `userId` (path) - User ID

**Success Response (200 OK):**
```json
{
  "id": 3,
  "username": "driver",
  "active": false
}
```

**Status Codes:**
- `200 OK` - User deactivated
- `404 Not Found` - User not found
- `401 Unauthorized` - Token invalid
- `403 Forbidden` - Only admins can deactivate

---

## 🏥 Health Endpoints

### **Get Health Status**

```http
GET /api/health
```

**Success Response (200 OK):**
```json
true
```

**Status Codes:**
- `200 OK` - Database is healthy
- `503 Service Unavailable` - Database not responding

---

### **Get Hello Message**

```http
GET /api/hello
```

**Success Response (200 OK):**
```json
"Hello World! LogiTrack is ready for action."
```

**Status Codes:**
- `200 OK` - API is working

---

## ⚠️ Common Error Responses

### **401 Unauthorized**
```json
{
  "status": 401,
  "message": "Token is invalid or expired"
}
```

### **403 Forbidden**
```json
{
  "status": 403,
  "message": "You do not have permission to access this resource"
}
```

### **404 Not Found**
```json
{
  "status": 404,
  "message": "Resource not found"
}
```

### **409 Conflict**
```json
{
  "status": 409,
  "message": "Tracking number already exists"
}
```

### **500 Internal Server Error**
```json
{
  "status": 500,
  "message": "An unexpected error occurred"
}
```

---

## 🧪 Example API Calls

### **Full Workflow Example**

```bash
# 1. Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"manager","password":"manager123"}'

# Response: Get TOKEN from response

# 2. Create Shipment
curl -X POST http://localhost:8080/api/shipments \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "trackingNumber": "TRK-99999",
    "deliveryAddress": "789 Pine St",
    "status": "CREATED",
    "driver": {"id": 2},
    "manager": {"id": 1},
    "length": 2.0,
    "width": 3.0,
    "height": 1.0,
    "distanceInMeters": 50.0,
    "costPerMeter": 10.0
  }'

# 3. Get All Shipments
curl -X GET http://localhost:8080/api/shipments \
  -H "Authorization: Bearer TOKEN"

# 4. Update Status
curl -X PUT http://localhost:8080/api/shipments/track/TRK-99999 \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"IN_TRANSIT"}'

# 5. Delete Shipment (Admin only)
curl -X DELETE http://localhost:8080/api/shipments/tracking/TRK-99999 \
  -H "Authorization: Bearer TOKEN"
```

---

**Last Updated:** February 16, 2026  
**API Version:** 1.0.0
