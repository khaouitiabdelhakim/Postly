# Postly Docker Management Script for Windows PowerShell
param(
    [Parameter(Position=0)]
    [string]$Command,
    
    [Parameter(Position=1)]
    [string]$Service,
    
    [Parameter(Position=2)]
    [string]$BackupFile
)

# Function to print colored output
function Write-Status($Message) {
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success($Message) {
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning($Message) {
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error($Message) {
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Function to check if Docker is running
function Test-Docker {
    try {
        docker info | Out-Null
        return $true
    } catch {
        Write-Error "Docker is not running. Please start Docker and try again."
        exit 1
    }
}

# Function to build the application
function Build-Application {
    Write-Status "Building Postly application..."
    Test-Docker
    
    docker-compose down --remove-orphans
    docker-compose build --no-cache
    
    Write-Success "Build completed successfully!"
}

# Function to start the application
function Start-Application {
    Write-Status "Starting Postly application..."
    Test-Docker
    
    # Create .env if it doesn't exist
    if (!(Test-Path ".env")) {
        Write-Warning ".env file not found. Creating from .env.example..."
        Copy-Item ".env.example" ".env"
        Write-Warning "Please update .env file with your configuration before running in production!"
    }
    
    docker-compose up -d
    
    Write-Success "Application started successfully!"
    Write-Status "Services:"
    Write-Status "- Frontend: http://localhost:3000"
    Write-Status "- API: http://localhost:8001"
    Write-Status "- Database: localhost:5432"
    Write-Status ""
    Write-Status "Run 'docker-compose logs -f' to view logs"
}

# Function to stop the application
function Stop-Application {
    Write-Status "Stopping Postly application..."
    Test-Docker
    
    docker-compose down
    
    Write-Success "Application stopped successfully!"
}

# Function to restart the application
function Restart-Application {
    Write-Status "Restarting Postly application..."
    Stop-Application
    Start-Application
}

# Function to view logs
function Show-Logs {
    Test-Docker
    
    if ($Service) {
        docker-compose logs -f $Service
    } else {
        docker-compose logs -f
    }
}

# Function to clean up
function Clean-Docker {
    Write-Status "Cleaning up Docker resources..."
    Test-Docker
    
    docker-compose down --volumes --remove-orphans
    docker system prune -f
    
    Write-Success "Cleanup completed!"
}

# Function to show status
function Show-Status {
    Test-Docker
    
    Write-Status "Postly Application Status:"
    docker-compose ps
}

# Function to access database
function Open-DatabaseShell {
    Test-Docker
    
    Write-Status "Connecting to database..."
    docker-compose exec database psql -U postly_user -d postly
}

# Function to backup database
function Backup-Database {
    Test-Docker
    
    $BackupFileName = "backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql"
    Write-Status "Creating database backup: $BackupFileName"
    
    docker-compose exec -T database pg_dump -U postly_user -d postly | Out-File -Encoding UTF8 $BackupFileName
    
    Write-Success "Database backup created: $BackupFileName"
}

# Function to restore database
function Restore-Database {
    if (!$BackupFile) {
        Write-Error "Please provide backup file path"
        Write-Host "Usage: .\docker-manage.ps1 restore <backup_file.sql>"
        exit 1
    }
    
    Test-Docker
    
    if (!(Test-Path $BackupFile)) {
        Write-Error "Backup file not found: $BackupFile"
        exit 1
    }
    
    Write-Status "Restoring database from: $BackupFile"
    
    Get-Content $BackupFile | docker-compose exec -T database psql -U postly_user -d postly
    
    Write-Success "Database restored successfully!"
}

# Function to show help
function Show-Help {
    Write-Host "Postly Docker Management Script for Windows PowerShell" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\docker-manage.ps1 {build|start|stop|restart|logs|clean|status|db-shell|backup|restore}" -ForegroundColor White
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor Yellow
    Write-Host "  build     - Build the Docker images" -ForegroundColor White
    Write-Host "  start     - Start the application" -ForegroundColor White
    Write-Host "  stop      - Stop the application" -ForegroundColor White
    Write-Host "  restart   - Restart the application" -ForegroundColor White
    Write-Host "  logs      - View application logs (optionally specify service)" -ForegroundColor White
    Write-Host "  clean     - Clean up Docker resources" -ForegroundColor White
    Write-Host "  status    - Show application status" -ForegroundColor White
    Write-Host "  db-shell  - Access database shell" -ForegroundColor White
    Write-Host "  backup    - Create database backup" -ForegroundColor White
    Write-Host "  restore   - Restore database from backup" -ForegroundColor White
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Yellow
    Write-Host "  .\docker-manage.ps1 start" -ForegroundColor White
    Write-Host "  .\docker-manage.ps1 logs api" -ForegroundColor White
    Write-Host "  .\docker-manage.ps1 restore backup_20231201_120000.sql" -ForegroundColor White
}

# Main script logic
switch ($Command.ToLower()) {
    "build" { Build-Application }
    "start" { Start-Application }
    "up" { Start-Application }
    "stop" { Stop-Application }
    "down" { Stop-Application }
    "restart" { Restart-Application }
    "logs" { Show-Logs }
    "clean" { Clean-Docker }
    "status" { Show-Status }
    "db-shell" { Open-DatabaseShell }
    "backup" { Backup-Database }
    "restore" { Restore-Database }
    default { Show-Help }
}
