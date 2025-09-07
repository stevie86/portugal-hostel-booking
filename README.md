# Portugal Hostel Booking Platform - MVP

A **minimal viable product (MVP)** for a hostel booking platform focused on Portugal, built with modern web technologies for streamlined hostel management and room inventory.

## 🎯 Current Status (Holiday Week Sprint)

### **✅ Completed Features**
- **Admin Room Management**: Complete CRUD interface for room inventory
- **Public Room Display**: Responsive listing with availability information
- **Availability System**: 7-day mock availability bars with booking percentages
- **Demo Mode Support**: Preview deployment compatibility
- **Responsive Design**: Mobile-first with Tailwind CSS

### **Core Architecture**
- **Frontend**: Next.js 14 (App Router) with React 18
- **Backend**: Next.js API routes with Prisma ORM
- **Database**: SQLite (development) with PostgreSQL migration path
- **Styling**: Tailwind CSS v3.4.0
- **Authentication**: JWT-based with middleware protection

### **Key Features**
- ✅ **Room Management**: Add/edit/delete room types with bed counts and bathroom options
- ✅ **Admin Dashboard**: Complete room management interface at `/admin`
- ✅ **Public Interface**: Room listing with availability at `/rooms`
- ✅ **Availability Display**: Visual progress bars showing room availability
- ✅ **API Layer**: RESTful endpoints for properties and rooms
- ✅ **Responsive Design**: Mobile-first with Tailwind CSS

### **Current Limitations**
- ⚠️ **No User Registration**: Admin access only (no public booking)
- ⚠️ **Single Property**: MVP assumes one property per deployment
- ⚠️ **No Payments**: Booking requests only (no payment processing)
- ⚠️ **No Reviews**: Basic functionality without user feedback
- ⚠️ **Demo Mode**: Changes may not persist in preview environments

---

## 🚀 **Operating the Application**

### **One-Command Setup (Recommended)**

For the fastest setup experience, use our convenience script:

```bash
# Complete automated setup
./scripts/setup.sh
```

This script will:
- ✅ Install all dependencies
- ✅ Set up environment variables
- ✅ Generate Prisma client
- ✅ Create and migrate database
- ✅ Seed with sample data
- ✅ Run build verification
- ✅ Provide next steps

### **Manual Setup (Alternative)**

```bash
# 1. Install dependencies
npm install

# 2. Set up database
npx prisma generate
npx prisma db push

# 3. Start development server
npm run dev
```

Visit **http://localhost:3000** to access the application.

### **User Roles & Access**

#### **Database Status Monitoring**
The admin dashboard now includes a **Database Status** component that:
- ✅ Checks database connection
- ✅ Verifies schema migration status
- ✅ Shows table information
- ✅ Provides one-click migration if needed
- ⚠️ Alerts if database setup is incomplete

#### **For Hostel Owners (Admin)**
1. **Access Admin Interface**: Navigate to `/admin`
2. **Check Database Status**: Ensure everything is properly set up
3. **Create Rooms**: Use the room creation form to add new room types
4. **Manage Inventory**: View all rooms and delete unwanted ones
5. **Monitor Availability**: Check room availability status

#### **For Guests (Public)**
1. **Browse Rooms**: Visit `/rooms` to see available room types
2. **Check Availability**: View availability bars and free bed counts
3. **Room Details**: See room specifications (beds, bathroom type)

---

## 📋 **Step-by-Step Operating Instructions**

### **1. Admin Room Management**

#### **Adding New Rooms**
1. Navigate to `/admin` in your browser
2. Fill out the "Add New Room" form:
   - **Room Name**: Enter a descriptive name (2-60 characters)
     - Examples: "6-Bed Mixed Dorm", "Private Double Room", "Female Dorm"
   - **Total Beds**: Select number of beds (1-24)
   - **Bathroom**: Check for private bathroom, uncheck for shared
3. Click **"Create Room"** button
4. Room appears in the "Current Rooms" list below

#### **Viewing Room Inventory**
- **Room List**: Shows all created rooms with details
- **Room Details**: Name, bed count, bathroom type
- **Real-time Updates**: Changes reflect immediately after creation/deletion

#### **Deleting Rooms**
1. Find the room in the "Current Rooms" list
2. Click the **red "Delete"** button next to the room
3. Confirm deletion in the popup dialog
4. Room is removed from the list

### **2. Public Room Browsing**

#### **Viewing Available Rooms**
1. Navigate to `/rooms` in your browser
2. Browse the grid of available room cards
3. Each card shows:
   - Room name and bed count
   - Bathroom type (Private/Shared)
   - Availability bar (next 7 days)
   - Number of free beds

#### **Understanding Availability**
- **Progress Bar**: Blue bar shows booking percentage (40-60% mock data)
- **Free Beds**: Calculated as: `total beds × (100 - booked percentage) ÷ 100`
- **Booking Status**: Visual indicator of room availability

### **3. Demo Mode Operation**

#### **Preview Deployments**
- **Demo Notice**: Yellow banner appears: "Demo mode: changes aren't persisted"
- **Functionality**: All features work normally
- **Persistence**: Changes don't save to database in preview environments
- **Local Development**: Full persistence when running locally

---

## 🔧 **Advanced Operations**

### **Database Management**

#### **Database Schema**
```sql
-- Core tables
CREATE TABLE Property (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Room (
  id TEXT PRIMARY KEY,
  propertyId TEXT NOT NULL,
  name TEXT NOT NULL,
  bedsTotal INTEGER NOT NULL,
  hasBathroom BOOLEAN DEFAULT FALSE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (propertyId) REFERENCES Property(id)
);
```

#### **Database Commands**
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# View database
npx prisma studio

# Reset database (development only)
npx prisma db push --force-reset
```

### **API Endpoints**

#### **Room Management APIs**
```javascript
// Get all rooms
GET /api/rooms

// Create new room
POST /api/rooms
{
  "propertyId": "property-uuid",
  "name": "6-Bed Mixed Dorm",
  "bedsTotal": 6,
  "hasBathroom": false
}

// Delete room
DELETE /api/rooms/{roomId}
```

#### **Property APIs**
```javascript
// Get all properties
GET /api/properties

// Get single property
GET /api/properties/{propertyId}
```

### **Testing the APIs**

```bash
# Test room creation
curl -X POST http://localhost:3000/api/rooms \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": "your-property-id",
    "name": "Test Room",
    "bedsTotal": 4,
    "hasBathroom": true
  }'

# Test room listing
curl http://localhost:3000/api/rooms

# Test room deletion
curl -X DELETE http://localhost:3000/api/rooms/{room-id}
```

---

## 🚀 **Deployment Operations**

### **Vercel Deployment**

#### **Environment Variables**
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="https://your-app.vercel.app"
```

#### **Build Configuration**
- **Build Command**: `prisma generate && next build`
- **Install Command**: `npm ci`
- **Node Version**: 18.x

#### **Post-Deployment Setup**
1. **Database**: Schema auto-creates on first deploy
2. **Demo Mode**: Automatically enabled in preview deployments
3. **Admin Access**: Create admin user via database or API

### **Local Development**

#### **Development Workflow**
```bash
# Start development server
npm run dev

# View at http://localhost:3000

# Make changes to code
# Changes auto-reload in browser

# Test admin interface at /admin
# Test public interface at /rooms
```

#### **Database Development**
```bash
# View database content
npx prisma studio

# Reset and seed database
npx prisma db push --force-reset
npx prisma db seed
```

---

## 🐛 **Troubleshooting**

### **Common Issues**

#### **Rooms Not Appearing**
- **Check**: Database connection and schema
- **Fix**: Run `npx prisma db push` to ensure schema is applied
- **Verify**: Check browser console for API errors

#### **Form Not Submitting**
- **Check**: Form validation (name length, bed count range)
- **Fix**: Ensure all required fields are filled correctly
- **Verify**: Check network tab for API request/response

#### **Demo Mode Not Working**
- **Check**: Environment variable `DEMO_READONLY=true`
- **Fix**: Set environment variable for preview deployments
- **Verify**: Look for yellow demo banner

### **Debug Commands**

```bash
# Check database content
npx prisma studio

# View API responses
curl http://localhost:3000/api/rooms

# Check build status
npm run build

# View application logs
npm run dev
```

---

## 📈 **Next Steps & Roadmap**

### **Immediate Improvements**
1. **User Authentication**: Admin user registration and login
2. **Multiple Properties**: Support for multiple hostels
3. **Real Availability**: Replace mock data with actual booking system
4. **Booking Flow**: Complete guest booking process

### **Advanced Features**
1. **Payment Integration**: Stripe/PayPal payment processing
2. **Email Notifications**: Booking confirmations and updates
3. **Review System**: Guest feedback and ratings
4. **Calendar Integration**: Real-time availability calendar

### **Production Readiness**
1. **PostgreSQL Migration**: Production database setup
2. **Security Audit**: Authentication and API security review
3. **Performance Optimization**: Image optimization and caching
4. **Monitoring**: Error tracking and analytics

---

This MVP provides a solid foundation for hostel room management with a clean, functional interface ready for real-world use and further development.

## 🚀 Deployment to Vercel

### **Prerequisites**
- Vercel account connected to your GitHub repository
- Environment variables configured in Vercel dashboard

### **Automatic Deployment**
```bash
# Push to main branch for automatic deployment
git add .
git commit -m "Deploy minimal MVP"
git push origin main
```

### **Vercel Configuration**
- **Build Command**: `prisma generate && next build`
- **Install Command**: `npm ci`
- **Node Version**: 18.x
- **Database**: SQLite (automatically created on first deploy)

### **Environment Variables** (Required)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secure-jwt-secret-here"
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="https://your-app.vercel.app"
```

### **Post-Deployment Steps**
1. **Database Setup**: Run `npx prisma db push` in Vercel functions
2. **Seed Data**: Run `npx prisma db seed` for sample data
3. **Admin Access**: Create admin user via API or database

---

## 🔐 Admin Login

### **Access Points**
- **Login URL**: `/login`
- **Admin Dashboard**: `/admin` (protected route)
- **Dashboard**: `/dashboard` (after login)

### **Authentication Flow**
1. Navigate to `/login`
2. Enter admin credentials
3. Redirected to `/dashboard` on success
4. Access `/admin` for room management

### **Current Authentication Status**
- ✅ **Middleware Protection**: Dashboard and admin routes require authentication
- ✅ **JWT Tokens**: Secure session management
- ✅ **Login API**: `/api/auth/login` endpoint functional
- ✅ **Admin User**: Created admin@example.com / admin123
- ✅ **Password Hashing**: bcryptjs for secure password storage
- ⚠️ **No Registration**: Admin users must be created manually

### **Creating Admin Users**
```sql
-- Manual database entry (SQLite)
INSERT INTO User (email, password, role)
VALUES ('admin@example.com', '$2b$10$hashedpassword', 'admin');
```

---

## 🏠 Managing Room Properties

### **Admin Interface** (`/admin`)

#### **Add New Rooms**
1. Navigate to `/admin`
2. Fill room details:
   - **Room Name**: e.g., "6-Bed Mixed Dorm"
   - **Total Beds**: 1-24 beds
   - **Bathroom**: Private or shared
3. Click "Create Room"

#### **View Current Rooms**
- **Room List**: Shows all created rooms
- **Details**: Name, bed count, bathroom type
- **Actions**: Delete rooms (with confirmation)

#### **Room Management Features**
- ✅ **Create Rooms**: Add new room types
- ✅ **Delete Rooms**: Remove unwanted rooms
- ✅ **Real-time Updates**: Changes reflect immediately
- ⚠️ **Single Property**: All rooms belong to one property
- ⚠️ **No Editing**: Rooms can only be created/deleted

### **API Endpoints**
```javascript
// Get all rooms
GET /api/rooms

// Create room
POST /api/rooms
{
  "propertyId": "property-uuid",
  "name": "6-Bed Mixed Dorm",
  "bedsTotal": 6,
  "hasBathroom": false
}

// Delete room
DELETE /api/rooms/{roomId}
```

### **Database Schema**
```sql
-- Key tables
Property (id, name, location, createdAt)
Room (id, propertyId, name, bedsTotal, hasBathroom, createdAt)
User (id, email, password, role, createdAt)
```

---

## 🛠 Development Operations

### **Local Development**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Database operations
npx prisma generate
npx prisma db push
npx prisma db seed

# Build for production
npm run build
```

### **Key Files Structure**
```
app/
├── layout.tsx          # Root layout (minimal, no i18n)
├── page.tsx           # Home page with search
├── admin/page.tsx     # Room management interface
├── login/page.tsx     # Authentication (has i18n issues)
├── api/
│   ├── properties/    # Property CRUD
│   ├── rooms/         # Room CRUD
│   └── admin/         # Admin utilities
lib/
├── prisma.ts          # Database client
├── auth-context.tsx   # Authentication context
└── services/          # Business logic services
```

### **Testing APIs**
```bash
# Test properties endpoint
curl http://localhost:3000/api/properties

# Test rooms endpoint
curl http://localhost:3000/api/rooms

# Test login API
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Test admin setup (requires auth)
curl -X POST http://localhost:3000/api/admin/setup
```

### **Testing Authentication**
1. **Login Test**: Visit `/login` and use admin@example.com / admin123
2. **Admin Access**: After login, visit `/admin` (should work)
3. **Dashboard Access**: After login, visit `/dashboard` (should work)
4. **Unauthorized Access**: Try visiting `/admin` without login (should redirect to `/login`)

---

## 📋 Next Steps & Improvements

### **Immediate Fixes Needed**
1. ✅ **Login i18n Fixed**: Removed `useTranslations` from login page
2. ✅ **Auth API Added**: Created `/api/auth/login` endpoint
3. ✅ **Admin User Created**: admin@example.com / admin123
4. **User Registration**: Implement admin user creation flow

### **Feature Additions**
1. **Property Management**: Multiple properties support
2. **Public Booking**: User registration and booking flow
3. **Payment Integration**: Stripe/PayPal integration
4. **Reviews System**: User feedback and ratings
5. **Email Notifications**: Booking confirmations

### **Production Readiness**
1. **PostgreSQL Migration**: Replace SQLite for production
2. **Environment Config**: Proper env variable management
3. **Error Handling**: Comprehensive error boundaries
4. **Security Audit**: JWT and API security review

---

## 📄 Quick Start

```bash
# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push

# Seed with sample data (optional)
npx prisma db seed

# Start development server
npm run dev
```

Visit **http://localhost:3000** to see the application.

### **First Time Setup**
1. **Database**: Schema is automatically created
2. **Admin Access**: Create admin user in database or via API
3. **Room Setup**: Use `/admin` to add room types
4. **Testing**: Use `/` to view public interface

This MVP provides a solid foundation for a hostel booking platform with core room management functionality, ready for deployment and further development.
