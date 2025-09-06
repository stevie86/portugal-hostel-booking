#!/bin/bash

# Portugal Hostel Booking - Automated Build and Check Script
# This script runs automated checks and builds for dev or production

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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check branch for production builds
check_production_branch() {
    local current_branch=$(git branch --show-current)
    print_status "Current branch: $current_branch"

    if [ "$current_branch" != "main" ]; then
        print_error "Production builds must be run from main branch!"
        print_status "Please switch to main branch for production deployment."
        print_status "Current branch: $current_branch"
        exit 1
    fi

    print_success "On main branch - proceeding with production build"
}

# Function to run tests
run_tests() {
    print_status "Running test suite..."
    if npm test; then
        print_success "All tests passed!"
    else
        print_error "Tests failed!"
        exit 1
    fi
}

# Function to check Node.js and npm versions
check_environment() {
    print_status "Checking environment..."

    if ! command_exists node; then
        print_error "Node.js is not installed!"
        exit 1
    fi

    if ! command_exists npm; then
        print_error "npm is not installed!"
        exit 1
    fi

    NODE_VERSION=$(node --version)
    NPM_VERSION=$(npm --version)

    print_success "Node.js version: $NODE_VERSION"
    print_success "npm version: $NPM_VERSION"
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    if npm install; then
        print_success "Dependencies installed successfully!"
    else
        print_error "Failed to install dependencies!"
        exit 1
    fi
}

# Function to check PostCSS configuration
check_postcss() {
    print_status "Checking PostCSS configuration..."

    if [ ! -f "postcss.config.js" ]; then
        print_warning "postcss.config.js not found, creating default configuration..."
        cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF
        print_success "Created postcss.config.js"
    else
        print_success "postcss.config.js exists"
    fi

    # Check if Tailwind config exists
    if [ ! -f "tailwind.config.js" ]; then
        print_error "tailwind.config.js not found!"
        exit 1
    else
        print_success "tailwind.config.js exists"
    fi
}

# Function to build for production
build_production() {
    print_status "Building for production..."

    # Set production environment
    export NODE_ENV=production

    # Fix potential PostCSS issues for Vercel
    export POSTCSS_CONFIG_PATH="./postcss.config.js"

    if npm run build; then
        print_success "Production build completed successfully!"
    else
        print_error "Production build failed!"
        print_status "Checking for common issues..."

        # Check if it's a PostCSS issue
        if grep -q "tailwindcss" package.json && ! grep -q "postcss" package.json; then
            print_warning "Possible PostCSS configuration issue detected"
            print_status "Try updating PostCSS configuration or check Tailwind version compatibility"
        fi

        exit 1
    fi
}

# Function to run build verification with failure handling
build_verify() {
    print_status "Running build verification..."

    # Set production environment
    export NODE_ENV=production

    # Fix potential PostCSS issues for Vercel
    export POSTCSS_CONFIG_PATH="./postcss.config.js"

    if npm run build; then
        print_success "Build completed successfully!"
    else
        print_error "Build failed!"
        TIMESTAMP=$(date +%Y%m%dT%H%M%S)
        BRANCH_NAME="build-failed-$TIMESTAMP"
        print_status "Creating new branch: $BRANCH_NAME"
        git checkout -b "$BRANCH_NAME"
        print_success "Switched to new branch: $BRANCH_NAME"
        print_status "You can now investigate the build failure on this branch."
        exit 1
    fi
}

# Function to start development server
start_development() {
    print_status "Starting development server..."

    # Set development environment
    export NODE_ENV=development

    print_success "Development server starting..."
    print_status "Press Ctrl+C to stop the server"
    npm run dev
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [dev|prod|test|check|verify]"
    echo ""
    echo "Commands:"
    echo "  dev     - Start development server"
    echo "  prod    - Build for production"
    echo "  test    - Run tests only"
    echo "  check   - Run environment checks only"
    echo "  verify  - Run build verification with failure handling"
    echo "  help    - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev     # Start development server"
    echo "  $0 prod    # Build for production deployment"
    echo "  $0 test    # Run test suite"
    echo "  $0 verify  # Run build verification"
}

# Main script logic
main() {
    local command="$1"

    case "$command" in
        "dev")
            check_environment
            install_dependencies
            check_postcss
            start_development
            ;;
        "prod")
            check_environment
            check_production_branch
            install_dependencies
            check_postcss
            run_tests
            build_production
            ;;
        "test")
            check_environment
            install_dependencies
            run_tests
            ;;
        "check")
            check_environment
            check_postcss
            print_success "Environment check completed!"
            ;;
        "verify")
            check_environment
            install_dependencies
            check_postcss
            build_verify
            ;;
        "help"|"-h"|"--help"|"")
            show_usage
            ;;
        *)
            print_error "Unknown command: $command"
            show_usage
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"