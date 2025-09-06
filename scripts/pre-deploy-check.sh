#!/bin/bash

# Portugal Hostel Booking - Pre-Deployment Check Script
# Ensures deployment requirements are met before proceeding

set -e  # Exit on any error

# Force English locale for consistent outputs
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

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

# Function to check current branch
check_branch() {
    local current_branch=$(git branch --show-current)
    print_status "Current branch: $current_branch"

    if [ "$current_branch" != "main" ]; then
        print_warning "Not on main branch. This is a production deployment requirement."
        print_status "Please switch to main branch or use a different deployment command."
        print_status "Current branch: $current_branch"
        exit 1
    fi

    print_success "On main branch - proceeding with production deployment"
}

# Function to check for uncommitted changes
check_clean_repo() {
    if ! git diff --quiet || ! git diff --staged --quiet; then
        print_error "Repository has uncommitted changes!"
        print_status "Please commit or stash your changes before deploying."
        git status --short
        exit 1
    fi

    print_success "Repository is clean"
}

# Function to run tests
run_tests() {
    print_status "Running test suite..."
    if npm test; then
        print_success "All tests passed!"
    else
        print_error "Tests failed! Cannot proceed with deployment."
        exit 1
    fi
}

# Function to check environment
check_environment() {
    print_status "Checking deployment environment..."

    # Check Node.js version
    if ! command -v node >/dev/null 2>&1; then
        print_error "Node.js is not installed!"
        exit 1
    fi

    NODE_VERSION=$(node --version | sed 's/v//')
    REQUIRED_NODE="18.0.0"

    if ! [ "$(printf '%s\n' "$REQUIRED_NODE" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_NODE" ]; then
        print_error "Node.js version $NODE_VERSION is below required $REQUIRED_NODE"
        exit 1
    fi

    print_success "Node.js version: $NODE_VERSION"

    # Check npm
    if ! command -v npm >/dev/null 2>&1; then
        print_error "npm is not installed!"
        exit 1
    fi

    NPM_VERSION=$(npm --version)
    print_success "npm version: $NPM_VERSION"
}

# Function to check required files
check_files() {
    print_status "Checking required files..."

    required_files=("package.json" "next.config.js" "tailwind.config.js" "postcss.config.js")

    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            print_error "Required file missing: $file"
            exit 1
        fi
    done

    print_success "All required files present"
}

# Main function
main() {
    print_status "Starting pre-deployment checks..."

    check_environment
    check_branch
    check_clean_repo
    check_files
    run_tests

    print_success "All pre-deployment checks passed!"
    print_status "Ready for deployment"
}

# Run main function
main "$@"