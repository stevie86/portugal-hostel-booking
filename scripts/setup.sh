#!/bin/bash

# Portugal Hostel Booking - Development Environment Manager
# This script manages the complete development environment setup and operations

set -e

# Default configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
COMMAND=${1:-"setup"}
SUBCOMMAND=${2:-""}

echo "🏨 Portugal Hostel Booking - Development Manager"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
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

print_command() {
    echo -e "${CYAN}[CMD]${NC} $1"
}

print_header() {
    echo -e "${PURPLE}=== $1 ===${NC}"
}

# Function to check if we're in the right directory
check_project_root() {
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Please run this script from the project root."
        exit 1
    fi
}

# Function to check Node.js version
check_node_version() {
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18 or higher is required. Current version: $(node --version)"
        exit 1
    fi
    print_success "Node.js version check passed: $(node --version)"
}

# Function to kill running processes on specific ports
kill_port() {
    local port=$1
    local name=$2
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_status "Killing $name on port $port..."
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        sleep 2
        print_success "$name stopped"
    else
        print_status "No $name running on port $port"
    fi
}

# Function to check if port is available
check_port() {
    local port=$1
    local name=$2
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "$name is already running on port $port"
        return 1
    else
        print_success "Port $port is available for $name"
        return 0
    fi
}

# Function to clean build artifacts
clean_build() {
    print_status "Cleaning build artifacts..."
    rm -rf .next
    rm -rf node_modules/.cache
    print_success "Build artifacts cleaned"
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    if [ -f "package-lock.json" ]; then
        npm ci 2>&1 | grep -v "npm WARN deprecated" || npm install 2>&1 | grep -v "npm WARN deprecated"
    else
        npm install 2>&1 | grep -v "npm WARN deprecated"
    fi
    print_success "Dependencies installed successfully"
}

# Function to setup database
setup_database() {
    print_status "Setting up database..."
    npx prisma generate
    npx prisma db push --force-reset
    print_success "Database schema created"
}

# Function to seed database
seed_database() {
    print_status "Seeding database with sample data..."
    npx prisma db seed
    print_success "Database seeded with sample data"
}

# Function to run build verification
verify_build() {
    print_status "Running build verification..."
    npm run build
    print_success "Build verification passed"
}

# Function to start development server
start_dev_server() {
    print_header "Starting Development Server"
    check_port 3000 "Next.js development server"
    if [ $? -eq 0 ]; then
        print_command "npm run dev"
        npm run dev
    else
        print_warning "Port 3000 is already in use by another process."
        read -p "Do you want to kill the existing process and start the server? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            kill_port 3000 "existing process"
            sleep 2
            print_command "npm run dev"
            npm run dev
        else
            print_error "Cannot start server while port 3000 is in use."
            print_status "Use './scripts/setup.sh stop dev' to stop the existing server first."
            exit 1
        fi
    fi
}

# Function to stop development server
stop_dev_server() {
    print_header "Stopping Development Server"
    kill_port 3000 "Next.js development server"
}

# Function to show status
show_status() {
    print_header "System Status"

    # Check Node.js
    echo -e "${BLUE}Node.js:${NC} $(node --version)"
    echo -e "${BLUE}npm:${NC} $(npm --version)"

    # Check ports
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${GREEN}Dev Server:${NC} Running on port 3000"
    else
        echo -e "${RED}Dev Server:${NC} Not running"
    fi

    # Check database
    if [ -f "prisma/dev.db" ]; then
        echo -e "${GREEN}Database:${NC} SQLite database exists"
    else
        echo -e "${RED}Database:${NC} Not initialized"
    fi

    # Check dependencies
    if [ -d "node_modules" ]; then
        echo -e "${GREEN}Dependencies:${NC} Installed"
    else
        echo -e "${RED}Dependencies:${NC} Not installed"
    fi

    # Check build
    if [ -d ".next" ]; then
        echo -e "${GREEN}Build:${NC} Cached"
    else
        echo -e "${RED}Build:${NC} Not cached"
    fi
}

# Function to reset everything
reset_all() {
    print_header "Resetting Everything"
    print_warning "This will delete all build artifacts, node_modules, and database!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        stop_dev_server
        print_status "Removing build artifacts..."
        rm -rf .next
        print_status "Removing dependencies..."
        rm -rf node_modules
        print_status "Removing database..."
        rm -f prisma/dev.db
        print_status "Removing lock file..."
        rm -f package-lock.json
        print_success "Reset complete. Run './scripts/setup.sh setup' to start fresh."
    else
        print_status "Reset cancelled."
    fi
}

# Main command handling
case $COMMAND in
    "setup")
        print_header "Complete Setup"
        check_project_root
        check_node_version
        install_dependencies
        setup_database
        seed_database
        verify_build

        print_header "Setup Complete!"
        echo ""
        print_success "🎉 Your Portugal Hostel Booking MVP is ready!"
        echo ""
        print_command "npm run dev"
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
        print_warning "Remember to update JWT secrets in .env for production!"
        ;;

    "start"|"dev")
        case $SUBCOMMAND in
            "server")
                start_dev_server
                ;;
            *)
                start_dev_server
                ;;
        esac
        ;;

    "stop")
        case $SUBCOMMAND in
            "dev"|"server")
                stop_dev_server
                ;;
            "all")
                stop_dev_server
                ;;
            *)
                stop_dev_server
                ;;
        esac
        ;;

    "clean")
        clean_build
        ;;

    "reset")
        reset_all
        ;;

    "status")
        show_status
        ;;

    "db")
        case $SUBCOMMAND in
            "setup")
                setup_database
                ;;
            "seed")
                seed_database
                ;;
            "reset")
                setup_database
                seed_database
                ;;
            *)
                print_error "Usage: ./scripts/setup.sh db [setup|seed|reset]"
                ;;
        esac
        ;;

    "deps")
        case $SUBCOMMAND in
            "install")
                install_dependencies
                ;;
            "update")
                print_status "Updating dependencies..."
                npm update
                print_success "Dependencies updated"
                ;;
            *)
                print_error "Usage: ./scripts/setup.sh deps [install|update]"
                ;;
        esac
        ;;

    "help"|"-h"|"--help")
        print_header "Portugal Hostel Booking - Development Manager"
        echo ""
        echo "USAGE:"
        echo "  ./scripts/setup.sh [command] [subcommand]"
        echo ""
        echo "COMMANDS:"
        echo "  setup          Complete environment setup (default)"
        echo "  start [server] Start development server"
        echo "  stop [dev]     Stop development server"
        echo "  clean          Clean build artifacts"
        echo "  reset          Reset everything (destructive!)"
        echo "  status         Show system status"
        echo "  db [setup|seed|reset] Database operations"
        echo "  deps [install|update] Dependency management"
        echo "  help           Show this help message"
        echo ""
        echo "EXAMPLES:"
        echo "  ./scripts/setup.sh              # Complete setup"
        echo "  ./scripts/setup.sh start        # Start dev server"
        echo "  ./scripts/setup.sh stop         # Stop dev server"
        echo "  ./scripts/setup.sh status       # Show status"
        echo "  ./scripts/setup.sh db reset     # Reset database"
        echo "  ./scripts/setup.sh clean        # Clean build cache"
        ;;

    *)
        print_error "Unknown command: $COMMAND"
        print_status "Run './scripts/setup.sh help' for usage information"
        exit 1
        ;;
esac