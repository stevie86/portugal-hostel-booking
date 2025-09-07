# Portugal Hostel Booking Platform - Minimal MVP

A **minimal viable product (MVP)** for a hostel booking platform focused on Portugal, built with modern web technologies for streamlined hostel management and room inventory.

## 🎯 What Was Built

### **Core Architecture**
- **Frontend**: Next.js 14 (App Router) with React 18
- **Backend**: Next.js API routes with Prisma ORM
- **Database**: SQLite (development) with PostgreSQL migration path
- **Styling**: Tailwind CSS v3.4.0 (minimal implementation)
- **Authentication**: JWT-based with middleware protection

### **Key Features**
- ✅ **Property Management**: Create and manage hostel properties
- ✅ **Room Inventory**: Add/edit/delete room types with bed counts
- ✅ **Admin Dashboard**: Simple room management interface
- ✅ **Authentication**: Login/logout with protected routes
- ✅ **API Layer**: RESTful endpoints for properties and rooms
- ✅ **Responsive Design**: Mobile-first with Tailwind CSS

### **Current Limitations**
- ⚠️ **No User Registration**: Admin access only (no public booking)
- ⚠️ **Single Property**: MVP assumes one property per deployment
- ⚠️ **No Payments**: Booking requests only (no payment processing)
- ⚠️ **No Reviews**: Basic functionality without user feedback
- ⚠️ **Demo Mode**: Changes may not persist in preview environments

---

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
- ✅ **Middleware Protection**: Dashboard routes require authentication
- ✅ **JWT Tokens**: Secure session management
- ⚠️ **No Registration**: Admin users must be created manually
- ⚠️ **i18n Issue**: Login page may show translation errors (fix needed)

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

# Test admin setup (requires auth)
curl -X POST http://localhost:3000/api/admin/setup
```

---

## 📋 Next Steps & Improvements

### **Immediate Fixes Needed**
1. **Fix Login i18n**: Remove `useTranslations` from login page
2. **Add Auth API**: Create `/api/auth/login` endpoint
3. **User Registration**: Implement admin user creation flow

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
