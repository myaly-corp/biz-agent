# Docker Deployment

The Skincare Routine Builder is designed to be easily deployed using Docker and Docker Compose. This document outlines the deployment architecture and provides instructions for deploying the application in various environments.

## Architecture Overview

The application is containerized using Docker with three main services:

1. **Frontend**: React application served by Nginx
2. **Backend**: FastAPI application
3. **SQLite Web**: Web interface for SQLite database management

These services are orchestrated using Docker Compose, which defines how they interact with each other and how they're exposed to the outside world.

## Docker Compose Configuration

The `compose.yml` file defines the services, networks, and volumes used by the application:

```yaml
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
      - "443:443"
    environment:
      - SECRET_KEY=378bb202bf0cee67ef9b5af7703ad36305aeccdb3850f1a017c6424da16f56f3
    networks:
      - app-network
    volumes:
      - .:/workspace:cached
      - frontend-node-modules:/workspace/frontend/node_modules
      # Mount both live and archive directories
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    networks:
      - app-network
    volumes:
      - .:/workspace:cached
      - backend-data:/workspace/backend/data
      - backend-venv:/workspace/backend/.venv
      - sqlite_data:/workspace/backend/db
    environment:
      - BACKEND_URL=http://backend:8000
      - IS_IN_DOCKER=true
      - SECRET_KEY=378bb202bf0cee67ef9b5af7703ad36305aeccdb3850f1a017c6424da16f56f3
    user: "1000:1000"

  sqlite-web:
    image: coleifer/sqlite-web
    networks:
      - app-network
    volumes:
      - sqlite_data:/data
    environment:
      - SQLITE_DATABASE=/data/forms.db
      - SQLITE_WEB_PASSWORD=admin
    command: >
      sh -c "
        chmod 777 /data &&
        touch /data/forms.db &&
        chmod 666 /data/forms.db &&
        sqlite_web -H 0.0.0.0 -p 8080 -r /data/forms.db
      "

volumes:
  frontend-node-modules:
  backend-data:
  backend-venv:
  sqlite_data:

networks:
  app-network:
    driver: bridge
```

### Key Components

1. **Frontend Service**:
   - Exposes ports 80 and 443 for HTTP and HTTPS traffic
   - Mounts SSL certificates from the host machine
   - Depends on the backend service

2. **Backend Service**:
   - Runs the FastAPI application
   - Shares volumes for data persistence
   - Uses environment variables for configuration

3. **SQLite Web Service**:
   - Provides a web interface for managing the SQLite database
   - Shares the SQLite database volume with the backend

4. **Volumes**:
   - `frontend-node-modules`: Persists npm dependencies
   - `backend-data`: Stores generated documents
   - `backend-venv`: Persists Python virtual environment
   - `sqlite_data`: Stores the SQLite database

5. **Network**:
   - `app-network`: Connects all services together

## Dockerfiles

### Frontend Dockerfile

```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
```

### Backend Dockerfile

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Deployment Instructions

### Prerequisites

- Docker and Docker Compose installed on the host machine
- SSL certificates (for production deployment)
- Sufficient disk space for volumes

### Development Deployment

For local development, you can use the following command:

```bash
docker-compose up -d
```

This will start all services in detached mode. You can view logs with:

```bash
docker-compose logs -f
```

The application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost/api
- SQLite Web: http://localhost:8080 (password: admin)

### Production Deployment

For production deployment, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/skincare-routine-builder.git
   cd skincare-routine-builder
   ```

2. **Configure SSL certificates**:
   Ensure that SSL certificates are available at `/etc/letsencrypt` on the host machine.

3. **Update environment variables**:
   Create a `.env` file with production settings:
   ```
   SECRET_KEY=your_secure_secret_key
   AZURE_WEBHOOK_URL=your_azure_webhook_url
   ```

4. **Start the services**:
   ```bash
   docker-compose up -d
   ```

5. **Verify deployment**:
   ```bash
   docker-compose ps
   ```

### Scaling

To scale the backend service for higher load:

```bash
docker-compose up -d --scale backend=3
```

Note: This requires additional configuration of a load balancer.

## Maintenance

### Updating the Application

To update the application:

1. **Pull the latest changes**:
   ```bash
   git pull
   ```

2. **Rebuild and restart the services**:
   ```bash
   docker-compose down
   docker-compose build
   docker-compose up -d
   ```

### Backup and Restore

To backup the SQLite database:

```bash
docker-compose exec backend sh -c "sqlite3 /workspace/backend/db/forms.db .dump > /workspace/backend/data/backup.sql"
```

To restore from backup:

```bash
docker-compose exec backend sh -c "cat /workspace/backend/data/backup.sql | sqlite3 /workspace/backend/db/forms.db"
```

### Monitoring

To monitor container resource usage:

```bash
docker stats
```

## Security Considerations

1. **Secret Management**:
   - Do not hardcode secrets in Docker Compose files
   - Use environment variables or Docker secrets for sensitive information

2. **Network Security**:
   - Limit exposed ports to only what's necessary
   - Use HTTPS for all external communication

3. **Volume Permissions**:
   - Ensure proper permissions on mounted volumes
   - Use non-root users in containers when possible

4. **Regular Updates**:
   - Keep base images updated
   - Regularly update dependencies

## Troubleshooting

### Common Issues

1. **Container fails to start**:
   ```bash
   docker-compose logs <service_name>
   ```

2. **Database connection issues**:
   Verify that the SQLite database file exists and has proper permissions:
   ```bash
   docker-compose exec backend ls -la /workspace/backend/db
   ```

3. **Frontend can't connect to backend**:
   Check network connectivity between containers:
   ```bash
   docker-compose exec frontend ping backend
   ```

4. **SSL certificate issues**:
   Verify that certificates are correctly mounted:
   ```bash
   docker-compose exec frontend ls -la /etc/letsencrypt/live
   ```

## Conclusion

Docker deployment provides a consistent and reproducible environment for the Skincare Routine Builder application. By following the instructions in this document, you can deploy the application in various environments with minimal configuration. 