# Postly Docker Deployment Guide

This guide explains how to deploy the Postly application using Docker and Docker Compose.

## Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose (usually included with Docker Desktop)
- At least 4GB of RAM available for Docker
- Ports 3000, 8001, and 5432 available on your host machine

## Quick Start

### 1. Clone and Navigate to Project
```bash
git clone <your-repo-url>
cd Postly
```

### 2. Configure Environment
Copy the example environment file and update it with your values:
```bash
cp .env.example .env
```

**Important**: Update the `.env` file with secure values, especially:
- `SECRET_KEY`: Generate a secure random key
- `POSTGRES_PASSWORD`: Use a strong password
- `VITE_API_URL`: Set to your domain for production

### 3. Build and Start
```bash
# Build the images
docker-compose build

# Start the application
docker-compose up -d
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **API**: http://localhost:8001
- **API Documentation**: http://localhost:8001/docs
- **Database**: localhost:5432

## Management Scripts

We provide management scripts for easier operation:

### Windows (PowerShell)
```powershell
# Start the application
.\docker-manage.ps1 start

# View logs
.\docker-manage.ps1 logs

# Stop the application
.\docker-manage.ps1 stop

# View all available commands
.\docker-manage.ps1
```

### Linux/Mac (Bash)
```bash
# Make the script executable
chmod +x docker-manage.sh

# Start the application
./docker-manage.sh start

# View logs
./docker-manage.sh logs

# Stop the application
./docker-manage.sh stop

# View all available commands
./docker-manage.sh
```

## Manual Docker Compose Commands

### Basic Operations
```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f api
docker-compose logs -f client
docker-compose logs -f database
```

### Database Operations
```bash
# Access database shell
docker-compose exec database psql -U postly_user -d postly

# Create database backup
docker-compose exec -T database pg_dump -U postly_user -d postly > backup.sql

# Restore database
docker-compose exec -T database psql -U postly_user -d postly < backup.sql
```

### Development Operations
```bash
# Rebuild specific service
docker-compose build api
docker-compose build client

# Restart specific service
docker-compose restart api
docker-compose restart client

# View service status
docker-compose ps

# Scale services (if needed)
docker-compose up -d --scale api=2
```

## Environment Variables

### API Configuration
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT signing key (change in production!)
- `ALGORITHM`: JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration (default: 30)
- `ENVIRONMENT`: Environment type (development/production)

### Database Configuration
- `POSTGRES_DB`: Database name
- `POSTGRES_USER`: Database user
- `POSTGRES_PASSWORD`: Database password

### Client Configuration
- `VITE_API_URL`: Backend API URL
- `NODE_ENV`: Node environment

## Production Deployment

### Security Considerations
1. **Change default passwords**: Update all default passwords in `.env`
2. **Use HTTPS**: Configure reverse proxy with SSL certificates
3. **Firewall**: Only expose necessary ports (80, 443)
4. **Updates**: Regularly update Docker images
5. **Backups**: Set up automated database backups

### Performance Optimization
1. **Resource limits**: Set memory and CPU limits in docker-compose.yml
2. **Caching**: Enable Redis for session caching
3. **CDN**: Use CDN for static assets
4. **Load balancing**: Use multiple API instances behind a load balancer

### Example Production Configuration
```yaml
# Add to docker-compose.yml for production
services:
  api:
    deploy:
      replicas: 2
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
    restart: always
    
  client:
    deploy:
      resources:
        limits:
          memory: 256M
          cpus: '0.25'
    restart: always
```

## Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Check what's using the ports
   netstat -tulpn | grep :3000
   netstat -tulpn | grep :8001
   netstat -tulpn | grep :5432
   ```

2. **Database connection issues**
   ```bash
   # Check database logs
   docker-compose logs database
   
   # Test database connection
   docker-compose exec database pg_isready -U postly_user
   ```

3. **API not starting**
   ```bash
   # Check API logs
   docker-compose logs api
   
   # Check if all dependencies are installed
   docker-compose exec api pip list
   ```

4. **Client build fails**
   ```bash
   # Check client logs
   docker-compose logs client
   
   # Rebuild with no cache
   docker-compose build --no-cache client
   ```

### Logs and Debugging
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api

# Follow logs in real-time
docker-compose logs -f --tail=100

# Check container status
docker-compose ps

# Inspect containers
docker inspect postly_api
docker inspect postly_client
docker inspect postly_database
```

### Clean Reset
If you need to completely reset the application:
```bash
# Stop and remove everything
docker-compose down --volumes --remove-orphans

# Remove all images
docker-compose build --no-cache

# Start fresh
docker-compose up -d
```

## Health Checks

The application includes built-in health checks:

- **API**: `http://localhost:8001/health`
- **Client**: `http://localhost:3000/health`
- **Database**: Built-in PostgreSQL health check

Monitor these endpoints to ensure your application is running correctly.

## Backup and Recovery

### Automated Backups
Set up a cron job for regular backups:
```bash
# Add to crontab (crontab -e)
0 2 * * * cd /path/to/postly && ./docker-manage.sh backup
```

### Recovery Process
1. Stop the application: `docker-compose down`
2. Restore database: `./docker-manage.sh restore backup_file.sql`
3. Start the application: `docker-compose up -d`

## Support

If you encounter issues:
1. Check the logs using the commands above
2. Ensure all ports are available
3. Verify your `.env` configuration
4. Try a clean rebuild: `docker-compose build --no-cache`

For more help, please check the main README.md or open an issue on GitHub.
