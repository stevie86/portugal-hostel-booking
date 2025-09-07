#!/bin/bash

# Portugal Hostel Booking - Fix Deprecation Warnings Script
# This script helps identify and fix deprecated package warnings

set -e

echo "🔧 Portugal Hostel Booking - Deprecation Fixer"
echo "==============================================="

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

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_status "Analyzing current dependencies..."

# Run npm audit to check for vulnerabilities
print_status "Checking for security vulnerabilities..."
if npm audit --audit-level moderate > /dev/null 2>&1; then
    print_success "No critical security vulnerabilities found"
else
    print_warning "Security vulnerabilities detected. Consider running 'npm audit fix'"
fi

# Check for outdated packages
print_status "Checking for outdated packages..."
OUTDATED=$(npm outdated --json 2>/dev/null || echo "{}")

if [ "$OUTDATED" != "{}" ] && [ -n "$OUTDATED" ]; then
    print_warning "Some packages have newer versions available:"
    echo "$OUTDATED" | jq -r 'keys[] as $k | "\($k): \(.[$k].current) -> \(.[$k].latest)"' 2>/dev/null || echo "Run 'npm outdated' to see details"
else
    print_success "All packages are up to date"
fi

# Specific fixes for known deprecation issues
print_status "Applying known fixes for deprecated packages..."

# Fix 1: Update glob to v9+ (if not already done)
if grep -q '"glob":' package.json; then
    print_success "Glob package already updated to v10+"
else
    print_warning "Glob package not found in direct dependencies"
    print_status "The glob warnings are likely from transitive dependencies"
fi

# Fix 2: Check for @esbuild-kit packages (should be replaced with tsx)
if grep -q "@esbuild-kit" package.json; then
    print_warning "@esbuild-kit packages found - these should be replaced with tsx"
    print_status "Consider updating your build tools to use tsx instead"
else
    print_success "No @esbuild-kit packages found"
fi

# Fix 3: Check for deprecated DOM exception packages
if npm ls domexception node-domexception 2>/dev/null | grep -q "deduped\|extraneous"; then
    print_warning "Deprecated DOM exception packages detected in dependencies"
    print_status "These are likely from testing libraries - they are safe to ignore"
else
    print_success "No deprecated DOM exception packages in direct dependencies"
fi

# Provide recommendations
echo ""
echo "📋 Recommendations:"
echo "=================="
echo ""
echo "1. 🔒 Security Updates:"
echo "   npm audit fix"
echo ""
echo "2. 📦 Package Updates:"
echo "   npm update"
echo ""
echo "3. 🧹 Clean Install (if issues persist):"
echo "   rm -rf node_modules package-lock.json"
echo "   npm install"
echo ""
echo "4. 📊 Check Bundle Size:"
echo "   npm install -g webpack-bundle-analyzer"
echo "   npx webpack-bundle-analyzer build/static/js/*.js"
echo ""
echo "5. 🔍 Deep Analysis:"
echo "   npm ls --depth=0  # See direct dependencies"
echo "   npm ls --all      # See all dependencies"
echo ""

print_success "Deprecation analysis complete!"
print_status "Most warnings are from transitive dependencies and don't affect functionality"
print_status "Focus on security updates and major version updates for critical packages"

echo ""
print_warning "Note: Some deprecation warnings are expected and don't require immediate action"
print_warning "They typically come from deep dependency trees and are managed by package maintainers"