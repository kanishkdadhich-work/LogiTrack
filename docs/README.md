# LogiTrack - Logistics Management System

## 🚀 Project Overview

LogiTrack is a **full-stack logistics management system** designed to streamline shipment tracking, driver management, and delivery operations. It provides a comprehensive platform for admins, managers, and drivers to collaborate efficiently on logistics operations.

### **Key Features**
- ✅ **Role-Based Access Control** (Admin, Manager, Driver)
- ✅ **Shipment Management** (Create, Read, Update, Delete)
- ✅ **Driver Assignment & Tracking**
- ✅ **Real-time Status Updates**
- ✅ **JWT Authentication** with token-based security
- ✅ **User Management** with account activation/deactivation
- ✅ **Cost Calculation** based on dimensions and distance
- ✅ **Responsive UI** with React & Tailwind CSS
- ✅ **RESTful API** with Spring Boot
- ✅ **PostgreSQL Database** with JPA/Hibernate ORM

---

## 📋 Tech Stack

### **Backend**
- **Framework:** Spring Boot 3.x (Java)
- **Database:** PostgreSQL
- **ORM:** JPA/Hibernate
- **Security:** JWT (JSON Web Tokens)
- **Build Tool:** Maven

### **Frontend**
- **Framework:** React 18
- **Styling:** Tailwind CSS, Custom CSS
- **HTTP Client:** Axios
- **Build Tool:** Vite
- **Icons:** Lucide React

### **Deployment**
- **Docker:** Containerization support
- **Docker Compose:** Multi-container orchestration

---

## 📁 Project Structure

```
LogiTrackDay2/
├── src/
│   ├── main/
│   │   ├── java/com/logitrack/logitrackday2/
│   │   │   ├── LogiTrackDay2Application.java          # Spring Boot entry point
│   │   │   ├── config/                                # Configuration classes
│   │   │   │   ├── DatabaseSync.java                  # Database initialization
│   │   │   │   ├── DataInitializer.java                # Sample data creation
│   │   │   │   └── SecurityConfig.java                 # Spring Security setup
│   │   │   ├── controller/                             # REST API endpoints
│   │   │   │   ├── AuthController.java                 # Login/Authentication
│   │   │   │   ├── HealthController.java               # Shipment endpoints
│   │   │   │   ├── DriverController.java               # Driver endpoints
│   │   │   │   ├── UserController.java                 # User endpoints
│   │   │   │   └── ShipmentController.java             # Shipment operations
│   │   │   ├── entity/                                 # Database entities
│   │   │   │   ├── User.java                           # User entity
│   │   │   │   ├── Driver.java                         # Driver entity
│   │   │   │   ├── Shipment.java                       # Shipment entity
│   │   │   │   └── AppStatus.java                      # System status
│   │   │   ├── exception/                              # Custom exceptions
│   │   │   │   ├── GlobalExceptionHandler.java         # Centralized error handling
│   │   │   │   ├── InvalidTrackingNumberException.java
│   │   │   │   ├── DuplicateIdException.java
│   │   │   │   └── DriverNotFoundException.java
│   │   │   ├── repository/                             # Data access layer
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── DriverRepository.java
│   │   │   │   ├── ShipmentRepository.java
│   │   │   │   └── AppStatusRepository.java
│   │   │   ├── security/                               # JWT & Authentication
│   │   │   │   ├── JwtUtil.java
│   │   │   │   ├── JwtAuthFilter.java
│   │   │   │   └── CustomUserDetailsService.java
│   │   │   └── service/                                # Business logic
│   │   │       ├── ShipmentService.java
│   │   │       └── ShipmentInterface.java
│   │   └── resources/
│   │       ├── application.properties                  # Prod config
│   │       └── application-dev.properties              # Dev config
│   └── test/
│       └── java/LogiTrackDay2ApplicationTests.java    # Unit tests
│
├── logitrack-ui/                                       # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx                           # Main dashboard
│   │   │   ├── LoginPage.jsx                           # Login form
│   │   │   ├── Navbar.jsx                              # Navigation
│   │   │   ├── ShipmentForm.jsx                        # Create/edit shipment
│   │   │   ├── ShipmentTable.jsx                       # Display shipments
│   │   │   ├── PackageTable.jsx                        # Package view
│   │   │   ├── UpdateShipmentStatus.jsx                # Status update form
│   │   │   └── pages/
│   │   │       ├── ShipmentsPage.jsx                   # Shipments management
│   │   │       ├── UserManagementPage.jsx              # User CRUD
│   │   │       └── ProfileSettingsPage.jsx             # User profile
│   │   ├── context/
│   │   │   └── AuthContext.jsx                         # Authentication state
│   │   ├── assets/
│   │   │   └── pages/
│   │   │       └── AdminDashboard.jsx                  # Admin view
│   │   ├── App.jsx                                     # Main app component
│   │   ├── main.jsx                                    # React entry point
│   │   └── index.css                                   # Global styles
│   ├── vite.config.js                                  # Vite configuration
│   ├── package.json                                    # Dependencies
│   └── Dockerfile                                      # Container config
│
├── pom.xml                                             # Maven dependencies
├── docker-compose.yml                                  # Docker setup
├── Dockerfile                                          # Backend container
└── README.md                                           # This file
```

---

## 🔐 User Roles & Permissions

### **1. ADMIN**
- ✅ View all shipments
- ✅ Create, edit, delete shipments
- ✅ Manage all users (create, activate/deactivate)
- ✅ Delete shipments
- ✅ Access user management
- ✅ Assign drivers
- ✅ Update shipment status

### **2. MANAGER**
- ✅ View all shipments
- ✅ Create, edit shipments
- ✅ Assign drivers to shipments
- ✅ Update shipment status
- ✅ View driver information
- ❌ Cannot delete shipments
- ❌ Cannot manage users

### **3. DRIVER**
- ✅ View only assigned shipments
- ✅ Update status (IN_TRANSIT, DELIVERED)
- ✅ View their profile
- ❌ Cannot create/edit shipments
- ❌ Cannot assign drivers
- ❌ Cannot delete shipments

---

## 🔄 Entity Relationships

```
User (1) ←→ (Many) Driver
  ↓
  └─→ Role Enum (ADMIN, MANAGER, DRIVER)

Driver (1) ←→ (Many) Shipment
User (1) ←→ (Many) Shipment (as Manager)

Shipment Fields:
  - id (PK)
  - trackingNumber (UNIQUE, Format: TRK-XXXXX)
  - deliveryAddress
  - status (CREATED, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, FAILED)
  - driver_id (FK)
  - manager_id (FK)
  - length, width, height (dimensions in meters)
  - distanceInMeters
  - costPerMeter
  - totalCost (calculated)
```

---

## 📊 Database Schema Overview

### **Users Table**
```sql
- id (BIGINT, PRIMARY KEY)
- username (VARCHAR, UNIQUE)
- password (VARCHAR, encrypted)
- role (ENUM: ADMIN, MANAGER, DRIVER)
- email (VARCHAR, UNIQUE)
- full_name (VARCHAR)
- phone_number (VARCHAR)
- active (BOOLEAN, default: true)
```

### **Drivers Table**
```sql
- id (BIGINT, PRIMARY KEY)
- name (VARCHAR)
- license_number (VARCHAR, UNIQUE)
- user_id (BIGINT, FK → Users)
- manager_id (BIGINT, FK → Users, NULLABLE)
```

### **Shipments Table**
```sql
- id (BIGINT, PRIMARY KEY)
- tracking_number (VARCHAR, UNIQUE, Format: TRK-XXXXX)
- delivery_address (VARCHAR)
- status (VARCHAR)
- driver_id (BIGINT, FK → Drivers, NULLABLE)
- manager_id (BIGINT, FK → Users)
- length (DECIMAL)
- width (DECIMAL)
- height (DECIMAL)
- distance_in_meters (DECIMAL)
- cost_per_meter (DECIMAL)
- total_cost (DECIMAL)
```

---

## 🔐 Authentication Flow

1. **Login Request**
   - User submits `username` and `password` to `/api/auth/login`
   - System validates credentials
   - System checks if user is `active` (new validation)
   - Returns JWT token + role

2. **Token Storage**
   - Token stored in localStorage
   - Role stored in localStorage for quick access
   - Token attached to all subsequent requests via Authorization header

3. **JWT Validation**
   - Every request passes through `JwtAuthFilter`
   - Filter validates token signature and expiry
   - Invalid tokens result in 401 Unauthorized
   - Auto-logout on token expiry (frontend)

4. **Authorization Check**
   - `SecurityConfig.java` defines role-based access rules
   - @PreAuthorize annotations enforce method-level security
   - Drivers can only access `/api/shipments/my-shipments`

---

## 🚀 Quick Start

### **Prerequisites**
- Java 17+
- Maven 3.8+
- Node.js 16+
- PostgreSQL 12+
- Docker & Docker Compose (optional)

### **1. Database Setup**
```bash
# Create PostgreSQL database
createdb logitrack
```

### **2. Backend Setup**
```bash
# Navigate to project root
cd /home/kanishk/IdeaProjects/LogiTrackDay2

# Set environment variables
export DB_URL="jdbc:postgresql://localhost:5432/logitrack"
export DB_USER="kanishk"
export DB_PASS="kanishk"

# Build and run
./mvnw clean compile
./mvnw spring-boot:run
```

### **3. Frontend Setup**
```bash
# Navigate to frontend
cd logitrack-ui

# Install dependencies
npm install

# Start dev server
npm run dev
```

### **4. Access Application**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080

### **Default Test Credentials**
```
Admin:    admin / admin123
Manager:  manager / manager123
Driver:   driver / driver123
```

---

## 📡 API Endpoints Summary

See `API_DOCUMENTATION.md` for complete endpoint details with request/response examples.

### **Authentication**
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info
- `GET /api/auth/verify` - Health check

### **Shipments**
- `GET /api/shipments` - Get all shipments (Admin/Manager)
- `GET /api/shipments/my-shipments` - Get driver's shipments (Driver)
- `GET /api/shipments/{id}` - Get shipment by ID
- `GET /api/shipments/tracking/{trackingNo}` - Get by tracking number
- `POST /api/shipments` - Create new shipment
- `PUT /api/shipments/{id}` - Update shipment
- `PUT /api/shipments/track/{trackingNo}` - Update status by tracking number
- `DELETE /api/shipments/{id}` - Delete shipment (Admin only)
- `DELETE /api/shipments/tracking/{trackingNumber}` - Delete by tracking (Admin only)

### **Drivers**
- `GET /api/drivers` - List all drivers
- `POST /api/drivers` - Create driver

### **Users**
- `GET /api/admin/users` - List all users (Admin only)
- `POST /api/admin/users` - Create user
- `GET /api/users/{userId}` - Get user details
- `PUT /api/users/{userId}` - Update user
- `PATCH /api/users/{userId}/activate` - Activate user
- `PATCH /api/users/{userId}/deactivate` - Deactivate user

---

## 🔄 Key Features Deep Dive

### **1. Shipment Creation with TRK Format**
- Tracking numbers must follow format: `TRK-XXXXX` (5 digits)
- System validates format on save
- Prevents duplicate tracking numbers
- Cannot change tracking number after creation

### **2. Cost Calculation**
- **Formula:** `totalCost = (length × width × height) × distanceInMeters × costPerMeter`
- Automatically calculated when dimensions provided
- Falls back to: `distanceInMeters × costPerMeter` if dimensions missing
- Updated on shipment edit

### **3. Driver Assignment**
- Managers can assign drivers during creation/edit
- Driver must exist in Driver table
- Driver must be linked to an active User account
- Only one driver per shipment
- Drivers can only see their assigned shipments

### **4. Status Workflow**
```
CREATED → IN_TRANSIT → OUT_FOR_DELIVERY → DELIVERED
                                        ↓
                                      FAILED
```

### **5. User Activation/Deactivation**
- Admin can set users as inactive
- Inactive users cannot login
- Login attempt shows: "Your account has been deactivated"
- Prevents unauthorized access

---

## 🧪 Testing the Application

### **Test 1: Admin Login & Create Shipment**
```bash
1. Login with admin/admin123
2. Go to Shipments Management
3. Create new shipment with:
   - Tracking: TRK-12345 (unique)
   - Address: Any address
   - Driver: Select from dropdown
   - Dimensions: 2m × 3m × 1.5m
   - Distance: 50m
   - Cost per meter: 10
4. Verify totalCost = 2×3×1.5×50×10 = 45,000
```

### **Test 2: Driver Dashboard**
```bash
1. Ensure driver has assigned shipments
2. Logout and login as driver/driver123
3. Should see only assigned shipments
4. Can update status (IN_TRANSIT, DELIVERED)
5. Cannot create/delete/edit shipments
```

### **Test 3: Inactive User**
```bash
1. Admin creates a user
2. Admin deactivates the user
3. Try logging in with deactivated user
4. Should see: "Your account has been deactivated"
```

### **Test 4: Manager Operations**
```bash
1. Login as manager/manager123
2. Create shipment and assign driver
3. Edit existing shipment with new driver
4. Update shipment status
5. Cannot delete shipments (403 error)
6. Cannot access user management
```

---

## 🛠️ Development Tips

### **Common Issues & Solutions**

| Issue | Cause | Solution |
|-------|-------|----------|
| Port 8080 in use | Another service using port | Kill process: `lsof -i :8080` |
| CORS errors | Frontend blocked by backend | Check `SecurityConfig.java` CORS settings |
| Driver not showing | Driver entity not created | Ensure User→Driver link exists |
| Empty driver dashboard | Query not matching username | Check `ShipmentRepository` query |
| Token expired | JWT validity period | Login again or clear localStorage |

### **Debugging**
- Backend logs print to console with 🔍 emoji prefixes
- Frontend console (F12) shows API calls and errors
- Check Hibernate SQL with `spring.jpa.show-sql=true`

### **Useful Maven Commands**
```bash
./mvnw clean compile       # Compile only
./mvnw clean test          # Run tests
./mvnw clean package       # Build JAR
./mvnw spring-boot:run     # Run with Maven
```

---

## 📦 Docker Deployment

### **Build Images**
```bash
# Backend
docker build -t logitrack-backend .

# Frontend
docker build -t logitrack-frontend ./logitrack-ui
```

### **Run with Docker Compose**
```bash
docker-compose up -d
```

### **Environment Variables**
```env
DB_URL=jdbc:postgresql://db:5432/logitrack
DB_USER=kanishk
DB_PASS=kanishk
SERVER_PORT=8080
```

---

## 📚 Additional Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design & component interaction
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Detailed API reference
- **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** - Database design details
- **[FEATURES_GUIDE.md](FEATURES_GUIDE.md)** - Feature explanations
- **[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)** - Development setup & testing

---

## 📝 License

This project is proprietary. All rights reserved.

---

## 👥 Contributing

For bug reports and feature requests, please contact the development team.

---

**Last Updated:** February 16, 2026  
**Version:** 1.0.0
