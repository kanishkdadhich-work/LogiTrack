# LogiTrack System Architecture

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  React 18 Frontend (http://localhost:3000)                       │
│  ├─ Components (Dashboard, Forms, Tables)                        │
│  ├─ Context API (Authentication State)                           │
│  └─ Axios HTTP Client                                            │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTPS/CORS
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API GATEWAY LAYER                             │
│  Spring Boot (http://localhost:8080)                             │
│  ├─ Rest Controllers (HTTP Endpoints)                            │
│  ├─ Security Filter (JWT Validation)                             │
│  ├─ Exception Handler (Global Error Handling)                    │
│  └─ CORS Configuration                                           │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                  BUSINESS LOGIC LAYER                            │
│  Service Classes (@Service)                                      │
│  ├─ ShipmentService (Shipment operations)                        │
│  ├─ UserService (User management)                                │
│  └─ DriverService (Driver operations)                            │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                   DATA ACCESS LAYER                              │
│  JPA Repositories (Spring Data)                                  │
│  ├─ UserRepository                                               │
│  ├─ DriverRepository                                             │
│  ├─ ShipmentRepository                                           │
│  └─ AppStatusRepository                                          │
└──────────────────────┬──────────────────────────────────────────┘
                       │ Hibernate ORM
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                                │
│  PostgreSQL (localhost:5432)                                     │
│  ├─ users table                                                  │
│  ├─ drivers table                                                │
│  ├─ shipments table                                              │
│  └─ app_status table                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication & Security Flow

### **1. Login Process**

```
User Input (username/password)
         ↓
POST /api/auth/login
         ↓
AuthController.login()
  ├─ Find user by username
  ├─ Check if user is ACTIVE
  ├─ Validate password (BCrypt)
  ├─ Generate JWT token
  └─ Return token + role
         ↓
Frontend stores in localStorage
         ↓
Token attached to all requests: Authorization: Bearer <token>
```

### **2. Request Validation Flow**

```
Incoming Request
         ↓
JwtAuthFilter.doFilter()
         ├─ Extract token from Authorization header
         ├─ Validate token signature
         ├─ Check token expiry
         ├─ Extract username from claims
         ├─ Load user details from database
         └─ Set SecurityContext with user info
         ↓
SecurityConfig - Check endpoint authorization
         ├─ Is endpoint public? → Allow
         ├─ Does request have token? → Yes/No
         ├─ Does user have required role? → Allow/Deny (403)
         └─ Does user have required permission? → Allow/Deny (403)
         ↓
Controller Method Executes
         ↓
@PreAuthorize checks (if any)
  ├─ hasRole('ADMIN')
  ├─ hasRole('MANAGER')
  ├─ hasRole('DRIVER')
  └─ hasAnyRole(...)
```

### **3. JWT Token Structure**

```
Header: {
  "alg": "HS256",        // Algorithm
  "typ": "JWT"           // Type
}

Payload: {
  "sub": "driver",       // Username (subject)
  "role": "DRIVER",      // User role
  "iat": 1707...,        // Issued at
  "exp": 1707...         // Expiration time
}

Signature: HMACSHA256(base64(header) + "." + base64(payload), SECRET_KEY)
```

---

## 🗂️ Component Architecture

### **Backend Structure**

```
com.logitrack.logitrackday2/
│
├── config/
│   ├── DatabaseSync.java
│   │   └─ Initializes database on startup
│   │   └─ Creates AppStatus record for health check
│   │
│   ├── DataInitializer.java
│   │   └─ Creates default users: admin, manager, driver
│   │   └─ Creates corresponding driver entity
│   │   └─ Fixes user roles if corrupted
│   │
│   └── SecurityConfig.java
│       └─ Defines authentication provider
│       └─ Configures security filter chain
│       └─ Sets up CORS policy
│       └─ Maps endpoints to roles
│       └─ JWT filter integration
│
├── controller/
│   ├── AuthController.java
│   │   ├─ POST /api/auth/login
│   │   │  └─ Authenticates user, returns JWT
│   │   ├─ GET /api/auth/me
│   │   │  └─ Returns current user info
│   │   └─ GET /api/auth/verify
│   │      └─ Basic health check
│   │
│   ├── HealthController.java
│   │   ├─ GET /api/health
│   │   │  └─ Database health check
│   │   ├─ GET /api/hello
│   │   │  └─ Simple greeting
│   │   ├─ GET/POST/PUT /api/shipments
│   │   │  └─ Shipment CRUD operations
│   │   ├─ GET /api/shipments/my-shipments
│   │   │  └─ Driver's assigned shipments
│   │   └─ DELETE /api/shipments
│   │      └─ Admin-only deletion
│   │
│   ├── DriverController.java
│   │   ├─ GET /api/drivers
│   │   │  └─ List all drivers
│   │   └─ POST /api/drivers
│   │      └─ Create new driver
│   │
│   └── UserController.java
│       ├─ GET /api/admin/users
│       │  └─ List all users
│       ├─ POST /api/admin/users
│       │  └─ Create new user
│       ├─ PATCH /api/users/{id}/activate
│       │  └─ Activate user
│       └─ PATCH /api/users/{id}/deactivate
│          └─ Deactivate user
│
├── entity/
│   ├── User.java (JPA Entity)
│   │   ├─ Implements UserDetails (Spring Security)
│   │   ├─ Fields: id, username, password, role, email, fullName, active
│   │   ├─ Role enum: ADMIN, MANAGER, DRIVER
│   │   └─ getAuthorities() returns role as GrantedAuthority
│   │
│   ├── Driver.java (JPA Entity)
│   │   ├─ Fields: id, name, licenseNumber
│   │   ├─ @OneToOne user (Link to User account)
│   │   ├─ @ManyToOne manager (Oversight user)
│   │   └─ @OneToMany shipments (Assigned shipments)
│   │
│   ├── Shipment.java (JPA Entity)
│   │   ├─ Fields: id, trackingNumber, deliveryAddress, status
│   │   ├─ Dimensions: length, width, height
│   │   ├─ Cost: distanceInMeters, costPerMeter, totalCost
│   │   ├─ @ManyToOne driver
│   │   ├─ @ManyToOne manager
│   │   └─ calculateTotalCost() method
│   │
│   └── AppStatus.java
│       └─ Single record for health checking
│
├── exception/
│   ├── GlobalExceptionHandler.java
│   │   └─ Handles all exceptions across app
│   │   └─ Returns formatted error responses
│   │   └─ Logs detailed error info
│   │
│   ├── InvalidTrackingNumberException.java
│   │   └─ Thrown when tracking number format invalid
│   │
│   ├── DuplicateIdException.java
│   │   └─ Thrown when tracking number already exists
│   │
│   └── DriverNotFoundException.java
│       └─ Thrown when assigned driver not found
│
├── repository/
│   ├── UserRepository extends JpaRepository
│   │   ├─ findByUsername(String username)
│   │   └─ findByEmail(String email)
│   │
│   ├── DriverRepository extends JpaRepository
│   │   └─ Inherited findById(), findAll(), save(), etc.
│   │
│   ├── ShipmentRepository extends JpaRepository
│   │   ├─ findByTrackingNumber(String)
│   │   ├─ findByDriver_User_Username(String)
│   │   │  └─ Custom @Query with FETCH JOIN
│   │   └─ findAllProjectedBy()
│   │
│   └── AppStatusRepository extends JpaRepository
│       └─ Simple health status records
│
├── security/
│   ├── JwtUtil.java
│   │   ├─ generateToken(username, role)
│   │   │  └─ Creates JWT with claims
│   │   ├─ extractUsername(token)
│   │   │  └─ Gets username from JWT claims
│   │   ├─ extractRole(token)
│   │   │  └─ Gets role from JWT claims
│   │   └─ validateToken(token)
│   │      └─ Validates signature & expiry
│   │
│   ├── JwtAuthFilter extends OncePerRequestFilter
│   │   ├─ doFilterInternal()
│   │   │  ├─ Extracts token from header
│   │   │  ├─ Validates token
│   │   │  ├─ Loads user from database
│   │   │  └─ Sets SecurityContext
│   │   └─ Passes request to next filter
│   │
│   └── CustomUserDetailsService implements UserDetailsService
│       └─ loadUserByUsername(username)
│          └─ Loads User entity and returns as UserDetails
│
└── service/
    ├── ShipmentService.java
    │   ├─ save(Shipment)
    │   │  ├─ Validates tracking number format (TRK-XXXXX)
    │   │  ├─ Checks for duplicate tracking numbers
    │   │  ├─ Calculates total cost from dimensions
    │   │  ├─ Validates driver exists
    │   │  └─ Saves to database
    │   │
    │   ├─ update(id, Shipment)
    │   │  ├─ Finds existing shipment
    │   │  ├─ Checks for duplicate tracking number (if changed)
    │   │  ├─ Updates driver assignment
    │   │  ├─ Updates manager assignment
    │   │  ├─ Recalculates costs
    │   │  └─ Saves updated shipment
    │   │
    │   ├─ delete(id)
    │   │  ├─ Checks if shipment exists
    │   │  └─ Deletes from database
    │   │
    │   ├─ getMyAssignedShipments(username)
    │   │  ├─ Logger startup message
    │   │  ├─ Queries repository using username
    │   │  ├─ Logs number of results
    │   │  └─ Returns driver's shipments
    │   │
    │   ├─ validateTrackingNumber(trackingNumber)
    │   │  ├─ Regex check: ^TRK-\d{5}$
    │   │  └─ Throws InvalidTrackingNumberException if invalid
    │   │
    │   ├─ assignDriverByTracking(trackingNumber, driverId)
    │   │  ├─ Finds shipment by tracking number
    │   │  ├─ Validates driver exists
    │   │  ├─ Checks shipment not delivered
    │   │  └─ Assigns and saves
    │   │
    │   └─ updateByTracking(trackingNumber, updatedData)
    │      ├─ Finds shipment by tracking number
    │      ├─ Updates status field only
    │      └─ Saves changes
    │
    └── ShipmentInterface.java (Rich Interface)
        ├─ getId()
        ├─ getTrackingNumber() / setTrackingNumber()
        ├─ getDeliveryAddress() / setDeliveryAddress()
        ├─ getStatus() / setStatus()
        ├─ updateFrom(ShipmentInterface other)
        │  └─ Copies fields from another shipment
        └─ delete(id)
```

---

## 🔄 Data Flow Examples

### **Example 1: Creating a Shipment**

```
User Action: Manager fills form and clicks "Save Shipment"
         ↓
Frontend: ShipmentForm.jsx
  ├─ Validates tracking number format client-side
  ├─ Collects: trackingNumber, deliveryAddress, dimensions, driver, etc.
  └─ POST /api/shipments with payload
         ↓
Backend: HealthController.create()
  └─ Calls ShipmentService.save()
         ↓
ShipmentService.save()
  ├─ validateTrackingNumber() - Check TRK-XXXXX format
  ├─ Check duplicate: shipmentRepository.findByTrackingNumber()
  ├─ Calculate cost: volume × distance × costPerMeter
  ├─ Load driver: driverRepository.findById()
  ├─ Load manager: userRepository.findById()
  ├─ Attach managed entities to shipment
  └─ shipmentRepository.save() - Persist to DB
         ↓
Database: INSERT INTO shipments (...)
         ↓
Response: Returns saved Shipment with all fields
         ↓
Frontend: ShipmentForm.jsx
  ├─ Shows success alert "✅ Shipment saved!"
  ├─ Clears form
  └─ Calls fetchShipments() to refresh table
```

### **Example 2: Driver Viewing Assigned Shipments**

```
User Action: Driver logs in
         ↓
Frontend: AuthContext
  ├─ POST /api/auth/login with driver/driver123
  ├─ Checks active status
  ├─ Receives JWT token
  └─ Stores in localStorage
         ↓
Frontend: ShipmentsPage.jsx
  └─ useEffect calls fetchShipments()
         ↓
Frontend: Axios request
  ├─ Detects user role = DRIVER
  ├─ GET /api/shipments/my-shipments (instead of /api/shipments)
  ├─ Sends Authorization header with token
  └─ Receives filtered data
         ↓
Backend: HealthController.getMyShipments()
  ├─ Extracts username from JWT token: "driver"
  ├─ Logs: "🚚 Fetching shipments for driver: driver"
  └─ Calls ShipmentService.getMyAssignedShipments("driver")
         ↓
ShipmentService.getMyAssignedShipments()
  ├─ Logs: "🔍 ShipmentService querying for driver username: driver"
  ├─ Calls ShipmentRepository.findByDriver_User_Username("driver")
  ├─ Custom @Query: Join Driver → User and match username
  ├─ Logs: "🔍 Query returned 3 shipments"
  ├─ Logs each result: "- TRK: TRK-12345, Driver: John Doe"
  └─ Returns List<Shipment>
         ↓
Database: SQL Query
  SELECT DISTINCT s FROM Shipment s
  LEFT JOIN FETCH s.driver d
  LEFT JOIN FETCH d.user u
  WHERE u.username = 'driver'
         ↓
Response: Only shipments where driver.user.username = 'driver'
         ↓
Frontend: ShipmentTable.jsx
  ├─ Displays only their assigned shipments
  ├─ Can update status (IN_TRANSIT, DELIVERED)
  └─ Cannot see other drivers' shipments
```

### **Example 3: Inactive User Login**

```
User Input: username=manager (inactive), password=manager123
         ↓
POST /api/auth/login
         ↓
AuthController.login()
  ├─ userRepository.findByUsername("manager")
  │   └─ Returns User object
  │
  ├─ NEW CHECK: if (!user.isActive())
  │   ├─ Logs: "❌ Login failed for user: manager - Account is inactive"
  │   └─ Returns: 403 Forbidden
  │      "Your account has been deactivated. Please contact an administrator."
  │
  └─ Exit (do not continue to password validation)
         ↓
Frontend: LoginPage.jsx
  ├─ Catches error response (403)
  ├─ Extracts message from response data
  └─ Displays in error div: "Your account has been deactivated..."
         ↓
User sees: ❌ Error message and cannot login
```

---

## 📊 State Management

### **Frontend: AuthContext (React Context API)**

```javascript
AuthContext provides:
  ├─ user: { username, role }          // Current logged-in user
  ├─ token: string                      // JWT token
  ├─ loading: boolean                   // Auth check in progress
  ├─ isAdmin: boolean                   // user.role === 'ADMIN'
  ├─ isManager: boolean                 // user.role === 'MANAGER'
  ├─ isDriver: boolean                  // user.role === 'DRIVER'
  ├─ login(username, password)          // Authenticate user
  └─ logout()                           // Clear session

Persistence:
  ├─ token → localStorage['token']
  ├─ role → localStorage['userRole']
  └─ username → localStorage['username']

On page refresh:
  └─ Restores user from localStorage (no re-login needed)
```

---

## 🔗 API Request/Response Patterns

### **Shipment Creation Request**

```json
POST /api/shipments
Authorization: Bearer <JWT_TOKEN>

{
  "trackingNumber": "TRK-12345",
  "deliveryAddress": "123 Main St, City",
  "status": "CREATED",
  "driver": { "id": 2 },
  "manager": { "id": 1 },
  "length": 2.0,
  "width": 3.0,
  "height": 1.5,
  "distanceInMeters": 50.0,
  "costPerMeter": 10.0
}
```

### **Shipment Response**

```json
{
  "id": 5,
  "trackingNumber": "TRK-12345",
  "deliveryAddress": "123 Main St, City",
  "status": "CREATED",
  "driver": {
    "id": 2,
    "name": "John Doe",
    "licenseNumber": "LC-123456",
    "user": { "id": 3, "username": "driver" }
  },
  "manager": {
    "id": 1,
    "username": "admin",
    "fullName": "Admin User",
    "role": "ADMIN"
  },
  "length": 2.0,
  "width": 3.0,
  "height": 1.5,
  "distanceInMeters": 50.0,
  "costPerMeter": 10.0,
  "totalCost": 45000.0
}
```

---

## 🔒 Security Layers

```
1. CORS Configuration
   └─ Only localhost:3000 accepted
   └─ Only specific HTTP methods allowed
   └─ Credentials required for cross-origin requests

2. Authentication (JWT)
   └─ Token signed with secret key
   └─ Token includes username and role claims
   └─ Token validated on every request

3. Authorization (Spring Security)
   └─ Role-based access control
   └─ Endpoint-level security rules
   └─ Method-level @PreAuthorize annotations

4. Data Validation
   └─ Tracking number format validation
   └─ User existence validation
   └─ Driver existence validation
   └─ Input sanitization

5. Password Security
   └─ Passwords hashed with BCrypt
   └─ Passwords never exposed in API responses
   └─ Passwords never logged

6. Account Control
   └─ User activation/deactivation
   └─ Inactive users cannot login
   └─ Admin controls user status
```

---

## 📈 Scalability Considerations

### **Current Bottlenecks**
- Single database instance (no replication)
- No caching layer (Redis)
- No async processing (message queues)
- Frontend forces download of all shipments

### **Future Improvements**
```
1. Add Caching
   ├─ Redis in-memory cache
   ├─ Cache driver & user lists
   └─ Cache user's shipments

2. Add Pagination
   ├─ Frontend pagination (show 10 per page)
   ├─ Backend cursor-based pagination
   └─ Lazy loading on scroll

3. Database Indexing
   ├─ INDEX on tracking_number
   ├─ INDEX on driver_id
   ├─ INDEX on manager_id
   ├─ INDEX on user.username
   └─ INDEX on user.active

4. Async Operations
   ├─ Message queue for notifications
   ├─ Background email processing
   ├─ Async cost calculations
   └─ Event-driven architecture

5. Database Replication
   ├─ Master-slave replication
   ├─ Read replicas for read-heavy ops
   └─ Connection pooling

6. API Rate Limiting
   ├─ Per-user rate limits
   ├─ Prevent API abuse
   └─ DDoS protection
```

---

## 🧪 Testing Strategy

### **Unit Tests**
- Service layer logic
- Entity validations
- Repository queries
- Exception handling

### **Integration Tests**
- API endpoint tests
- Database transaction tests
- Security filter tests
- JWT validation tests

### **E2E Tests**
- Complete user workflows
- Cross-role scenarios
- Error handling
- Edge cases

---

**Last Updated:** February 16, 2026
