#!/bin/bash

# Portugal Hostel Booking - Complete Setup Script
# This script handles all setup steps for the MVP application

set -e  # Exit on any error

echo "🏨 Portugal Hostel Booking - Complete Setup"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js version check passed: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_success "npm version: $(npm -v)"

# Step 1: Install dependencies
print_status "Step 1: Installing dependencies..."
if [ -f "package-lock.json" ]; then
    npm ci
else
    npm install
fi
print_success "Dependencies installed successfully"

# Step 2: Check environment variables
print_status "Step 2: Checking environment variables..."
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating with default values..."
    cat > .env << EOF
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secure-jwt-secret-here-change-in-production"
NEXTAUTH_SECRET="your-nextauth-secret-here-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
EOF
    print_success "Created .env file with default values"
    print_warning "Please update JWT_SECRET and NEXTAUTH_SECRET in .env for production use"
else
    print_success "Environment file exists"
fi

# Step 3: Generate Prisma client
print_status "Step 3: Generating Prisma client..."
if npx prisma generate; then
    print_success "Prisma client generated successfully"
else
    print_error "Failed to generate Prisma client"
    exit 1
fi

# Step 4: Set up database
print_status "Step 4: Setting up database..."
if npx prisma db push --force-reset; then
    print_success "Database schema created successfully"
else
    print_error "Failed to create database schema"
    exit 1
fi

# Step 5: Seed database
print_status "Step 5: Seeding database with sample data..."
if npx prisma db seed; then
    print_success "Database seeded with sample data"
else
    print_warning "Database seeding failed or no seed script found"
    print_status "Continuing without seeding..."
fi

# Step 6: Build check
print_status "Step 6: Running build check..."
if npm run build; then
    print_success "Build completed successfully"
else
    print_error "Build failed. Please check the errors above."
    exit 1
fi

# Step 7: Final instructions
echo ""
echo "🎉 Setup Complete!"
echo "=================="
print_success "Your Portugal Hostel Booking MVP is ready!"
echo ""
echo "🚀 To start the development server:"
echo "   npm run dev"
echo ""
echo "📱 Access your application:"
echo "   • Admin Interface: http://localhost:3000/admin"
echo "   • Public Rooms: http://localhost:3000/rooms"
echo "   • Home Page: http://localhost:3000"
echo ""
echo "👤 Default Admin Credentials:"
echo "   • Email: admin@example.com"
echo "   • Password: admin123"
echo ""
print_warning "Remember to update the JWT secrets in .env for production use!"
echo ""
print_status "Happy coding! 🏨✨"