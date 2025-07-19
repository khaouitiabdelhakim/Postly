#!/bin/bash

# Postly Docker Management Script

set -e

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

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to build the application
build() {
    print_status "Building Postly application..."
    check_docker
    
    docker-compose down --remove-orphans
    docker-compose build --no-cache
    
    print_success "Build completed successfully!"
}

# Function to start the application
start() {
    print_status "Starting Postly application..."
    check_docker
    
    # Create .env if it doesn't exist
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from .env.example..."
        cp .env.example .env
        print_warning "Please update .env file with your configuration before running in production!"
    fi
    
    docker-compose up -d
    
    print_success "Application started successfully!"
    print_status "Services:"
    print_status "- Frontend: http://localhost:3000"
    print_status "- API: http://localhost:8001"
    print_status "- Database: localhost:5432"
    print_status ""
    print_status "Run 'docker-compose logs -f' to view logs"
}

# Function to stop the application
stop() {
    print_status "Stopping Postly application..."
    check_docker
    
    docker-compose down
    
    print_success "Application stopped successfully!"
}

# Function to restart the application
restart() {
    print_status "Restarting Postly application..."
    stop
    start
}

# Function to view logs
logs() {
    check_docker
    
    if [ $# -eq 0 ]; then
        docker-compose logs -f
    else
        docker-compose logs -f "$1"
    fi
}

# Function to clean up
clean() {
    print_status "Cleaning up Docker resources..."
    check_docker
    
    docker-compose down --volumes --remove-orphans
    docker system prune -f
    
    print_success "Cleanup completed!"
}

# Function to show status
status() {
    check_docker
    
    print_status "Postly Application Status:"
    docker-compose ps
}

# Function to access database
db_shell() {
    check_docker
    
    print_status "Connecting to database..."
    docker-compose exec database psql -U postly_user -d postly
}

# Function to backup database
backup() {
    check_docker
    
    BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
    print_status "Creating database backup: $BACKUP_FILE"
    
    docker-compose exec -T database pg_dump -U postly_user -d postly > "$BACKUP_FILE"
    
    print_success "Database backup created: $BACKUP_FILE"
}

# Function to restore database
restore() {
    if [ $# -eq 0 ]; then
        print_error "Please provide backup file path"
        echo "Usage: $0 restore <backup_file.sql>"
        exit 1
    fi
    
    check_docker
    
    BACKUP_FILE="$1"
    if [ ! -f "$BACKUP_FILE" ]; then
        print_error "Backup file not found: $BACKUP_FILE"
        exit 1
    fi
    
    print_status "Restoring database from: $BACKUP_FILE"
    
    docker-compose exec -T database psql -U postly_user -d postly < "$BACKUP_FILE"
    
    print_success "Database restored successfully!"
}

# Main script logic
case "$1" in
    build)
        build
        ;;
    start|up)
        start
        ;;
    stop|down)
        stop
        ;;
    restart)
        restart
        ;;
    logs)
        logs "${@:2}"
        ;;
    clean)
        clean
        ;;
    status)
        status
        ;;
    db-shell)
        db_shell
        ;;
    backup)
        backup
        ;;
    restore)
        restore "$2"
        ;;
    *)
        echo "Postly Docker Management Script"
        echo ""
        echo "Usage: $0 {build|start|stop|restart|logs|clean|status|db-shell|backup|restore}"
        echo ""
        echo "Commands:"
        echo "  build     - Build the Docker images"
        echo "  start     - Start the application"
        echo "  stop      - Stop the application"
        echo "  restart   - Restart the application"
        echo "  logs      - View application logs (optionally specify service)"
        echo "  clean     - Clean up Docker resources"
        echo "  status    - Show application status"
        echo "  db-shell  - Access database shell"
        echo "  backup    - Create database backup"
        echo "  restore   - Restore database from backup"
        echo ""
        echo "Examples:"
        echo "  $0 start"
        echo "  $0 logs api"
        echo "  $0 restore backup_20231201_120000.sql"
        ;;
esac
