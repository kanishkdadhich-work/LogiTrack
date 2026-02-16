# LogiTrack Features Guide

Comprehensive guide to all features in LogiTrack with examples and usage instructions.

---

## 🔑 Feature 1: Role-Based Access Control (RBAC)

### **Overview**
LogiTrack implements three distinct roles, each with specific permissions and capabilities.

### **Role Hierarchy**

```
┌─────────────────────────────────────────────────────────┐
│                    ADMIN (Super User)                    │
│  • Full system access                                    │
│  • User management                                       │
│  • Delete operations                                     │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
    MANAGER                     DRIVER
    • Create shipments        • View own shipments
    • Edit shipments          • Update own status
    • Assign drivers          • Limited to assigned
    • Cannot delete           • No creation rights
    • Cannot manage users     • No deletion rights
```

### **Admin Capabilities**

1. **Shipment Management**
   - Create, read, update, delete any shipment
   - Assign/reassign drivers
   - Force status changes

2. **User Management**
   - Create new users (ADMIN, MANAGER, DRIVER)
   - Activate/deactivate accounts
   - View all user information
   - Change user passwords (future feature)

3. **System Management**
   - View system health status
   - Access all company data
   - Generate reports (future feature)
   - Configure system settings (future feature)

4. **Driver Management**
   - View all drivers
   - Create new driver entities
   - Associate drivers with users

**Example Admin Workflow:**
```
1. Login as admin/admin123
2. Navigate to Shipments or User Management tab
3. Can perform all CRUD operations
4. Can deactivate accounts
5. Can delete any shipment
```

### **Manager Capabilities**

1. **Shipment Operations**
   - Create new shipments with TRK-XXXXX format
   - Edit existing shipments
   - Assign drivers from available drivers list
   - Update shipment status
   - View all company shipments
   - Filter/search shipments

2. **Cost Management**
   - Set dimensions (length, width, height)
   - Set distance and cost per meter
   - View calculated total cost

3. **Restrictions**
   - Cannot delete shipments
   - Cannot manage users
   - Cannot create/delete drivers
   - Cannot deactivate accounts

**Example Manager Workflow:**
```
1. Login as manager/manager123
2. Go to Shipments Management
3. Click "New Shipment" button
4. Fill form with shipment details
5. Select driver from dropdown
6. Save shipment
7. Edit shipments as needed
8. Update status during delivery
9. View all company shipments
```

### **Driver Capabilities**

1. **Shipment Management**
   - View ONLY shipments assigned to them
   - Cannot see other drivers' shipments
   - Cannot see all system shipments

2. **Status Updates**
   - Can only set status to: IN_TRANSIT, DELIVERED
   - Cannot create new shipments
   - Cannot edit shipment details

3. **Profile**
   - View their own profile
   - View assigned shipments details

4. **Restrictions**
   - Cannot create shipments
   - Cannot edit shipment details
   - Cannot delete shipments
   - Cannot assign drivers
   - Cannot view other drivers' shipments
   - Limited status update options

**Example Driver Workflow:**
```
1. Login as driver/driver123
2. Dashboard automatically shows ONLY their shipments
3. Can see: Tracking #, Address, Current Status
4. Click shipment to view details
5. Can update status clicking "Update Status" button
6. Select: IN_TRANSIT or DELIVERED
7. Save status change
8. View profile (future feature)
```

### **Enforcement Methods**

1. **Backend Security (Spring Security)**
   ```java
   // In SecurityConfig.java
   .requestMatchers("/api/shipments/my-shipments")
       .hasAnyRole("ADMIN", "MANAGER", "DRIVER")
   
   .requestMatchers("/api/shipments/**")
       .hasAnyRole("ADMIN", "MANAGER")
   
   .requestMatchers(HttpMethod.DELETE, "/api/shipments/**")
       .hasRole("ADMIN")
   ```

2. **Method-Level Authorization (Annotations)**
   ```java
   @PreAuthorize("hasRole('ADMIN')")
   public String deleteByTrackingNumber(String trackingNumber)
   ```

3. **Frontend Conditional Rendering (UI)**
   ```jsx
   {(isAdmin || isManager) && (
       <button onClick={() => setShowAddForm(true)}>
           New Shipment
       </button>
   )}
   
   {isDriver && (
       <p>Your assigned deliveries: {shipments.length}</p>
   )}
   ```

---

## 📦 Feature 2: Shipment Management

### **Shipment Creation**

#### **Tracking Number Validation**
- **Format:** `TRK-XXXXX` (TRK- followed by exactly 5 digits)
- **Examples:** TRK-12345, TRK-00001, TRK-99999
- **Invalid Examples:** TRK-1234 (too short), TRK-123456 (too long), 12345TRK, TRK12345 (missing dash)
- **Validation Location**
  - Frontend: Axios shows error before submit
  - Backend: `ShipmentService.validateTrackingNumber()` regex check
  - Database: UNIQUE constraint prevents duplicates

#### **Cost Calculation**
- **Formula (with dimensions):**
  ```
  totalCost = (length × width × height) × distanceInMeters × costPerMeter
  ```
  - Example: (2m × 3m × 1.5m) × 50m × 10 = 45,000

- **Fallback Formula (without dimensions):**
  ```
  totalCost = distanceInMeters × costPerMeter
  ```
  - Example: 50m × 10 = 500

- **Auto-Calculation**
  - Happens on create and edit
  - Backend calculates, returns to frontend
  - Cannot be manually overridden

#### **Creation Steps**

```
Manager Creates Shipment:
  1. Click "New Shipment" button
  2. Enter tracking number (TRK-XXXXX format)
  3. Enter delivery address
  4. Select driver from dropdown (optional)
  5. Enter package dimensions: length, width, height
  6. Enter delivery distance in meters
  7. Enter cost per meter
  8. Click "Save Shipment"
  9. System auto-calculates total cost
  10. Shipment appears in table
  11. Status defaults to "CREATED"
```

#### **Validation Rules**

| Field | Rule | Error |
|-------|------|-------|
| Tracking Number | TRK-##### regex | "Invalid format. Must be TRK-12345" |
| Tracking Number | Must be unique | 409 Conflict error |
| Delivery Address | Non-empty string | Form validation |
| Driver | Must exist in database | 404 Driver not found |
| Manager | Must exist & be MANAGER/ADMIN | 400 Bad Request |
| Length | Positive number or null | Backend validation |
| Width | Positive number or null | Backend validation |
| Height | Positive number or null | Backend validation |
| Distance | Positive number or null | Backend validation |
| Cost Per Meter | Positive number or null | Backend validation |

### **Shipment Editing**

#### **What Can Be Changed**
- Delivery address ✅
- Driver assignment ✅ (including changing/removing)
- Status ✅
- Manager assignment ✅
- Dimensions (length, width, height) ✅ → Recalculates cost
- Distance ✅ → Recalculates cost
- Cost per meter ✅ → Recalculates cost

#### **What Cannot Be Changed**
- Tracking number ❌ (disabled in form)
- Shipment ID ❌ (auto-generated)

#### **Editing Steps**

```
Manager Edits Shipment:
  1. Find shipment in table
  2. Click Edit button (pencil icon)
  3. Form pre-fills with current data
  4. Tracking number field is disabled (greyed out)
  5. Change desired fields
  6. If dimensions changed, cost auto-recalculates
  7. Click "Save Shipment"
  8. System validates all changes
  9. Updates database
  10. Form closes
  11. Table refreshes
```

### **Shipment Status Workflow**

```
Status Flow Diagram:

CREATED (initial)
   ↓
IN_TRANSIT (manager/driver)
   ↓
OUT_FOR_DELIVERY (manager/driver)
   ↓
DELIVERED (final success) ✓
   ↓
FAILED (delivery failed) ✗

Note: Cannot revert status backwards
Driver can only set: IN_TRANSIT, DELIVERED
Admin/Manager can set any status
```

#### **Status Update Methods**
1. **Dashboard - Edit Form**
   - Access via Edit button
   - Change status dropdown
   - Save to persist

2. **Status Update Dialog**
   - Access via "Update Status" button (driver view)
   - Quick status change
   - Limited options for drivers

3. **API Call**
   - PUT /api/shipments/track/{trackingNumber}
   - Send: { "status": "DELIVERED" }

### **Shipment Deletion**

#### **Deletion Access**
- **Admin Only** - Can delete any shipment
- **Managers** - Cannot delete (403 Forbidden)
- **Drivers** - Cannot delete (403 Forbidden)

#### **Deletion Methods**
1. **By ID**
   - DELETE /api/shipments/{id}
   - Requires admin token

2. **By Tracking Number**
   - DELETE /api/shipments/tracking/{trackingNumber}
   - Requires admin token

#### **Deletion Confirmation**
```
Admin clicks Delete button
  ↓
Browser shows: "Are you sure you want to delete shipment: TRK-12345?"
  ↓
User clicks OK or Cancel
  ↓
If OK: DELETE request sent to backend
If Cancel: Nothing happens
  ↓
If successful: Table refreshes, shipment gone
If error: Error message displayed
```

---

## 👥 Feature 3: User Management

### **User Creation**

#### **New User Form (Admin Only)**

| Field | Description | Example |
|-------|-------------|---------|
| Username | Login credential, must be unique | driver2 |
| Password | Encrypted, BCrypt hashed | SecurePass123! |
| Email | Contact email, must be unique | driver2@logitrack.com |
| Full Name | Display name | John Smith |
| Role | ADMIN, MANAGER, or DRIVER | DRIVER |
| Phone | Contact number | 555-1234 |

#### **User Creation Steps**

```
Admin Creates New User:
  1. Login with admin account
  2. Go to "User Management" tab
  3. Click "Create New User" button
  4. Fill in all required fields
  5. Select role from dropdown
  6. Click "Create" button
  7. System validates:
     - Username doesn't exist
     - Email doesn't exist
     - Password meets criteria
     - Role is valid
  8. User created with status: ACTIVE
  9. New user can now login
  10. If role is DRIVER, admin should also create Driver entity
```

### **User Activation/Deactivation**

#### **Why Deactivate?**
- Employee left company
- Employee on temporary leave
- Account security issue
- Change of position

#### **Deactivation Effect**
- User **CANNOT** login
- Receives error: "Your account has been deactivated. Please contact an administrator."
- Active session tokens still work until expiry (security: should logout)
- User data remains in database (preserved for audit trail)

#### **Reactivation**
- Admin clicks "Activate" button
- User immediately able to login again
- No data loss, all assigned shipments remain

#### **Deactivation Steps**

```
Admin Deactivates User:
  1. Go to "User Management" tab
  2. Find user in table
  3. Click "Deactivate" button (if currently active)
  4. Confirmation dialog appears
  5. Click confirm
  6. User status changes to inactive
  7. Table updates
  
Result:
  - User cannot login
  - All their existing sessions become invalid on next action
  - Assigned shipments remain in system
  - Admin can reactivate later
```

### **User-Driver Linking**

#### **Why Link?**
- Users table stores authentication (username, password)
- Drivers table stores driver-specific info (license, vehicle, etc.)
- One User can have One Driver entity

#### **Manual Linking Process**

```
Scenario: Admin creates user "smith_driver"
  1. User created in users table
  2. Admin goes to "Create Driver" form
  3. Creates driver entity:
     - Name: "Sandra Smith"
     - License: "LC-445566"
     - Selects User: "smith_driver" (from dropdown)
  4. Driver entity created with FK to user
  5. Now "smith_driver" user can be assigned to shipments
  6. Shipment manager can see "Sandra Smith" in driver dropdown
```

### **Password Management**

#### **Hashing**
- Passwords stored as BCrypt hashes (never plain text)
- Salt automatically included
- Irreversible (cannot decrypt)

#### **Login Validation**
```
User enters password: "MyPass123"
     ↓
BCryptPasswordEncoder.matches("MyPass123", storedHash)
     ↓
Returns: true/false
     ↓
If true: Generate JWT and login
If false: Return 401 Unauthorized
```

#### **Password Reset** (Future Feature)
- Currently not implemented
- Would require email service
- Would send reset link with token
- User sets new password via link

---

## 🚗 Feature 4: Driver Management

### **Driver Entity**

#### **Driver Information**
```json
{
  "id": 2,
  "name": "John Doe",
  "licenseNumber": "LC-123456",
  "user": {
    "id": 3,
    "username": "driver",
    "email": "driver@logitrack.com",
    "active": true
  },
  "manager": {
    "id": 1,
    "username": "admin",
    "role": "ADMIN"
  }
}
```

#### **Driver Creation Steps**

```
Admin/Manager Creates Driver:
  1. Go to create form (future: dedicated page)
  2. Enter:
     - Name: "New Driver Name"
     - License: "LC-789012"
     - Select associated User: dropdown
     - Optional: Assign manager
  3. Click Create
  4. Driver entity created with FK to user
  5. Now available in shipment driver dropdown
```

### **Driver Assignment to Shipments**

#### **Assignment Methods**

1. **During Shipment Creation**
   - Manager fills form
   - Selects driver from dropdown
   - System validates driver exists
   - Creates relationship during save

2. **During Shipment Edit**
   - Manager clicks Edit
   - Changes driver selection
   - Can change to different driver
   - Can set to "Unassigned" (null)
   - System validates new driver exists

3. **API Direct Assignment**
   ```
   PUT /api/shipments/{id}
   {
     "driver": { "id": 3 }
   }
   ```

#### **Validation Rules**
- Driver must exist in `drivers` table
- Driver's user must exist and be ACTIVE
- Driver's user must have DRIVER role (enforced by business logic)

### **Driver's Assigned Shipments View**

#### **Driver Dashboard**

```
When driver logs in:
  1. System recognizes role = DRIVER
  2. ShipmentsPage fetches from /api/shipments/my-shipments
  3. Query: WHERE driver.user.username = 'driver'
  4. Only shipments where driver is assigned shown
  5. Driver sees:
     - Tracking number
     - Delivery address
     - Current status
     - Update status button (limited options)
  6. Cannot:
     - Create new shipments
     - Edit details
     - Assign other drivers
     - Delete shipments
```

#### **Shipment Table - Driver View**

| Column | Visible | Editable | Actions |
|--------|---------|----------|---------|
| Tracking # | ✅ | ❌ | View |
| Status | ✅ | ✅ | Update |
| Address | ✅ | ❌ | - |
| Driver | ✅ | ❌ | - |
| Manager | ✅ | ❌ | - |
| Edit Button | ❌ | - | - |
| Delete Button | ❌ | - | - |

---

## 🔐 Feature 5: Authentication & Security

### **Login Process**

#### **Step-by-Step Login**

```
User enters credentials: username="driver", password="driver123"
     ↓
POST /api/auth/login
     ↓
1. Find user: userRepository.findByUsername("driver")
     ↓
2. Check if ACTIVE: if (!user.isActive()) return 403
     ↓
3. Validate password: passwordEncoder.matches(password, hash)
     ↓
4. If invalid: Return 401 "Invalid credentials"
     ↓
5. Extract role: user.getRole() = Role.DRIVER
     ↓
6. Generate JWT: jwtUtil.generateToken("driver", "DRIVER")
     ├─ Payload includes: username, role, expiry
     ├─ Signed with secret key
     └─ Returns: "eyJhbGciOi..."
     ↓
7. Return response:
   {
     "token": "eyJhbGciOi...",
     "role": "DRIVER",
     "username": "driver"
   }
     ↓
Frontend receives response
     ↓
8. Store in localStorage:
   - localStorage['token'] = "eyJhbGciOi..."
   - localStorage['userRole'] = "DRIVER"
   - localStorage['username'] = "driver"
     ↓
9. Set axios default header:
   Authorization: Bearer eyJhbGciOi...
     ↓
10. Navigate to /dashboard
     ↓
11. Dashboard loads user data from AuthContext
```

### **JWT Token Structure**

#### **Token Anatomy**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
  eyJzdWIiOiJkcml2ZXIiLCJyb2xlIjoiRFJJVkVSIiwiaWF0IjoxNzA20LCJleHAiOjE3MDIwfQ.
  TJVA95rM51oAZjHx0JLQPWL-Rds0i6lJxfXKxkA
```

**Decoded:**
```json
// Header
{
  "alg": "HS256",
  "typ": "JWT"
}

// Payload
{
  "sub": "driver",      // Subject (username)
  "role": "DRIVER",     // User role
  "iat": 1707020000,    // Issued at timestamp
  "exp": 1707023600     // Expiry timestamp (1 hour later)
}

// Signature
HMACSHA256(
  base64(header) + "." + base64(payload),
  "your-secret-key"
)
```

### **Token Usage**

#### **Every API Request**

```
Frontend makes request:
  ├─ Axios Interceptor adds header:
  │  Authorization: Bearer eyJhbGciOi...
  │
  └─ Request sent

Backend receives request:
  ├─ JwtAuthFilter intercepts
  ├─ Extracts token from Authorization header
  ├─ Validates signature
  ├─ Checks expiration
  ├─ Gets username from token
  ├─ Loads user from database
  ├─ Sets SecurityContext with user info
  │
  └─ Request continues to controller

Controller executes
  ├─ Checks @PreAuthorize if any
  ├─ Executes business logic
  │
  └─ Returns response
```

### **Token Expiration**

#### **Expiration Time**
- Default: 60 minutes
- Configurable in `JwtUtil.java`
- Property: `JWT_EXPIRATION_MS`

#### **Expired Token Behavior**

```
User's token valid for 1 hour:
  ├─ Created: 1:00 PM
  └─ Expires: 2:00 PM

User makes request at 2:01 PM:
  ├─ Frontend sends expired token
  ├─ JwtAuthFilter detects expiration
  ├─ Sets empty SecurityContext
  ├─ Returns 401 Unauthorized
  │
  └─ Frontend Axios interceptor catches 401
     ├─ Logs out user (logout())
     ├─ Clears localStorage
     ├─ Redirects to /login
     │
     └─ User sees login page, must login again
```

### **Inactive User Block**

#### **New Login Check**

```
User account deactivated by admin:
  ├─ User active field set to false
  └─ User does not know yet

User tries to login:
  ├─ POST /api/auth/login
  ├─ EnglishController.login() finds user
  ├─ NEW: if (!user.isActive()) {
  │     Logs: "❌ Login failed... Account is inactive"
  │     Returns: 403 Forbidden
  │     Message: "Your account has been deactivated..."
  └─ }

Frontend receives 403:
  ├─ Catches in login error handler
  ├─ Displays error message
  │
  └─ User sees: "Your account has been deactivated..."
```

---

## 📊 Feature 6: Data Persistence & Database

### **Database Tables Overview**

#### **Users Table**
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,        -- BCrypt hash
  role VARCHAR(50) NOT NULL,             -- ENUM
  email VARCHAR(255) UNIQUE,
  full_name VARCHAR(255),
  phone_number VARCHAR(20),
  active BOOLEAN DEFAULT true,           -- Can login?
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Key Points:**
- Passwords stored as BCrypt hashes (irreversible)
- Username, email must be unique
- Active flag controls login access
- Role determines permissions

#### **Drivers Table**
```sql
CREATE TABLE drivers (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  license_number VARCHAR(255) UNIQUE NOT NULL,
  user_id BIGINT REFERENCES users(id),  -- FK, One-to-One
  manager_id BIGINT REFERENCES users(id), -- FK, Many-to-One
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Key Points:**
- Links to Users table via user_id
- user_id should reference user with DRIVER role
- manager_id optional, references MANAGER or ADMIN user
- license_number must be unique

#### **Shipments Table**
```sql
CREATE TABLE shipments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  tracking_number VARCHAR(255) UNIQUE NOT NULL,  -- TRK-XXXXX
  delivery_address VARCHAR(500) NOT NULL,
  status VARCHAR(50) NOT NULL,                    -- ENUM
  driver_id BIGINT REFERENCES drivers(id),       -- FK, nullable
  manager_id BIGINT REFERENCES users(id),        -- FK
  length DECIMAL(10,2),
  width DECIMAL(10,2),
  height DECIMAL(10,2),
  distance_in_meters DECIMAL(10,2),
  cost_per_meter DECIMAL(10,2),
  total_cost DECIMAL(15,2),                      -- Calculated
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Key Points:**
- tracking_number format enforced by app (TRK-XXXXX)
- Tracking number must be unique
- driver_id can be NULL (unassigned)
- manager_id should reference ADMIN or MANAGER user
- Dimensions and costs can be NULL
- total_cost calculated by backend

### **Data Relationships**

```
User (1) ←────────────→ (Many) Driver
  ↑                        │
  │ (Oversight)            │ (Assignment)
  │                        ↓
Manager                  Shipment ←─── Manager (ADMIN/MANAGER)
(User with                   │
 MANAGER or                   └─→ Status tracking
 ADMIN role)                       Cost calculation
```

### **Data Validation in JPA**

```java
@Entity
@Table(name = "shipments")
public class Shipment {
    
    @Id
    @GeneratedValue
    private Long id;                          // Auto-generated by DB
    
    @Column(unique = true, nullable = false)
    private String trackingNumber;            // Must be unique & not null
    
    @Column(nullable = false)
    private String deliveryAddress;           // Required
    
    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;                    // Optional, validates exists
    
    @ManyToOne
    @JoinColumn(name = "manager_id")
    private User manager;                     // Required, validates exists
    
    // Nullable - calculated by service
    private Double length;
    private Double width;
    private Double height;
    private Double distanceInMeters;
    private Double costPerMeter;
    private Double totalCost;
}
```

---

## 🧪 Feature 7: Error Handling

### **Exception Types**

#### **InvalidTrackingNumberException**
```
When: Tracking number format invalid
Format: TRK-XXXXX
Error: "Invalid tracking number format..."
Status: 400 Bad Request
```

#### **DuplicateIdException**
```
When: Tracking number already exists
Error: "Tracking number already exists"
Status: 409 Conflict (HTTP code for duplicates)
```

#### **DriverNotFoundException**
```
When: Assigned driver doesn't exist
Error: "Driver not found!"
Status: 404 Not Found
```

#### **ResourceNotFoundException**
```
When: Shipment/User/Resource not found
Error: "Resource not found with tracking number: ..."
Status: 404 Not Found
```

### **Global Exception Handler**

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(InvalidTrackingNumberException.class)
    public ResponseEntity<String> handleInvalidTracking(
        InvalidTrackingNumberException ex) {
        
        return ResponseEntity
            .status(400)
            .body(ex.getMessage());
    }
    
    @ExceptionHandler(DuplicateIdException.class)
    public ResponseEntity<String> handleDuplicate(
        DuplicateIdException ex) {
        
        return ResponseEntity
            .status(409)
            .body("Tracking number already exists");
    }
    
    // More exception handlers...
}
```

---

## 🎯 Feature 8: Data Validation & Business Rules

### **Tracking Number Validation**

```
Validation: ^TRK-\d{5}$

Valid Examples:
  ✅ TRK-00001
  ✅ TRK-12345
  ✅ TRK-99999

Invalid Examples:
  ❌ TRK-1234 (only 4 digits)
  ❌ TRK-123456 (6 digits)
  ❌ TRK1234 (missing dash)
  ❌ 12345 (no TRK prefix)
  ❌ trk-12345 (lowercase)

Locations:
  1. Frontend: ShipmentForm.jsx regex validation
  2. Backend: ShipmentService.validateTrackingNumber()
  3. Database: UNIQUE constraint
```

### **Driver Assignment Rules**

```
Rules:
  ✅ Driver must exist in drivers table
  ✅ Driver's user must exist and be ACTIVE
  ✅ Can assign during creation
  ✅ Can reassign during edit
  ✅ Can unassign (set to null)
  
  ❌ Cannot assign non-existent driver
  ❌ Cannot assign from deleted user
  ❌ Cannot assign inactive user
```

### **Status Transition Rules**

```
Allowed Transitions:
  CREATED → any status ✅
  IN_TRANSIT → IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, FAILED ✅
  OUT_FOR_DELIVERY → DELIVERED, FAILED ✅
  DELIVERED → Cannot change ❌ (final state)
  FAILED → Can restart (future feature)

Driver Restrictions:
  Can set: IN_TRANSIT, DELIVERED
  Cannot set: CREATED, OUT_FOR_DELIVERY, FAILED, FAILED

Admin/Manager:
  Can set any status
```

### **Cost Calculation Rules**

```
With Dimensions:
  totalCost = (length × width × height) × distanceInMeters × costPerMeter
  
Without Dimensions:
  totalCost = distanceInMeters × costPerMeter
  
If All Null:
  totalCost remains null (no calculation)

Rules:
  ✅ Automatic on creation
  ✅ Recalculated on edit if dimensions change
  ✅ Displays with 2 decimal places
  ❌ Cannot be manually set
```

---

## 📋 Testing Scenarios

### **Happy Path: Complete Shipment Lifecycle**

```
1. Admin creates users
   ├─ User 1: admin (ADMIN role)
   ├─ User 2: manager (MANAGER role)
   └─ User 3: driver (DRIVER role)

2. Admin creates driver entity
   ├─ Name: "John Doe"
   ├─ License: "LC-123456"
   └─ Links to User 3 (driver)

3. Manager logs in
   ├─ Login: manager/manager123
   └─ ✅ Redirected to dashboard

4. Manager creates shipment
   ├─ Tracking: TRK-12345
   ├─ Address: "123 Main St"
   ├─ Driver: "John Doe"
   ├─ Dimensions: 2×3×1.5
   ├─ Distance: 50m
   ├─ Cost/m: 10
   ├─ Total Cost Calculated: 45,000
   └─ ✅ Shipment created (status: CREATED)

5. Manager updates status
   ├─ Edit shipment
   ├─ Status: IN_TRANSIT
   └─ ✅ Saved

6. Driver logs in
   ├─ Login: driver/driver123
   └─ ✅ Sees TRK-12345 in their dashboard

7. Driver updates status
   ├─ Click "Update Status"
   ├─ Select: DELIVERED
   └─ ✅ Status updated

8. Manager verifies completion
   ├─ Login again
   ├─ Find TRK-12345
   ├─ Status: DELIVERED
   └─ ✅ Shipment complete
```

---

**Last Updated:** February 16, 2026
