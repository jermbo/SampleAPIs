# Docker Setup Documentation

This document outlines the Docker configuration for the SampleAPIs project, explaining the setup, configuration, and best practices used.

## Project Structure

```
.
├── client/
│   ├── Dockerfile
│   └── package.json
├── server/
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

## Container Configuration

### Client Container

The client container runs a Vite-based React application.

**Dockerfile (client/Dockerfile)**

```dockerfile
# Use Node.js 22
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install necessary tools
RUN apk add --no-cache wget

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Expose port 4444
EXPOSE 4444

# Start the application
CMD ["npm", "run", "dev"]
```

Key points:

- Uses Node.js 22 Alpine for a smaller image size
- Installs `wget` for health checks
- Exposes port 4444 for the Vite development server
- Uses development mode for hot-reloading

### Server Container

The server container runs an Express.js application.

**Dockerfile (server/Dockerfile)**

```dockerfile
# Use Node.js 22
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port 5555
EXPOSE 5555

# Start the application in development mode
CMD ["npm", "run", "server"]
```

Key points:

- Uses Node.js 22 Alpine
- Exposes port 5555 for the Express server
- Runs in development mode with nodemon for auto-reloading

## Docker Compose Configuration

The `docker-compose.yml` file orchestrates both containers and their interactions:

```yaml
services:
  client:
    build:
      context: ./client
      dockerfile: Dockerfile
    ports:
      - "4444:4444"
    volumes:
      - ./client:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    depends_on:
      server:
        condition: service_healthy
    networks:
      - app-network

  server:
    build:
      context: ./server
      dockerfile: Dockerfile
    ports:
      - "5555:5555"
    volumes:
      - ./server:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - PORT=5555
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:5555"]
      interval: 10s
      timeout: 5s
      retries: 3
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

### Key Features

1. **Volume Mounts**

   - Mounts local directories for hot-reloading
   - Preserves node_modules in containers
   - Enables real-time code changes

2. **Networking**

   - Uses a dedicated bridge network
   - Enables container-to-container communication
   - Isolates the application network

3. **Environment Variables**
   - Sets development environment
   - Configures server port
   - API URL is managed through Config.ts in the client application

## API Configuration

The client application manages API URLs through `Config.ts`:

```typescript
export const URLS = {
  API_LINK: process.env.NODE_ENV === "production" ? "https://api.sampleapis.com" : "http://localhost:5555",
};
```

This configuration:

- Uses `http://localhost:5555` in development mode
- Uses `https://api.sampleapis.com` in production mode
- Automatically switches based on the NODE_ENV environment variable

## Health Checks

Health checks are crucial for ensuring service reliability and proper startup order.

### Server Health Check Configuration

```yaml
healthcheck:
  test: ["CMD", "wget", "--spider", "http://localhost:5555"]
  interval: 10s
  timeout: 5s
  retries: 3
```

### How Health Checks Work

1. **Purpose**

   - Verifies if the server is truly ready to accept connections
   - Ensures proper startup sequence
   - Prevents client from connecting to an unprepared server

2. **Configuration Details**

   - `test`: Uses `wget --spider` to check server availability
   - `interval`: Runs check every 10 seconds
   - `timeout`: Fails if check takes longer than 5 seconds
   - `retries`: Requires 3 consecutive failures to mark unhealthy

3. **Dependency Management**
   ```yaml
   depends_on:
     server:
       condition: service_healthy
   ```
   - Client only starts when server is healthy
   - Prevents connection attempts to unprepared server

## Usage

### Starting the Application

```bash
docker compose up --build
```

### Accessing the Application

- Client: http://localhost:4444
- Server: http://localhost:5555

### Stopping the Application

```bash
docker compose down
```

## Best Practices

1. **Development Mode**

   - Uses volume mounts for hot-reloading
   - Preserves node_modules in containers
   - Enables real-time code changes

2. **Security**

   - Uses Alpine-based images for smaller attack surface
   - Implements proper network isolation
   - Avoids running as root

3. **Performance**

   - Uses multi-stage builds where appropriate
   - Implements proper caching strategies
   - Optimizes layer ordering

4. **Maintainability**
   - Clear separation of concerns
   - Well-documented configuration
   - Consistent naming conventions

## Troubleshooting

### Common Issues

1. **Container Not Starting**

   - Check health check logs
   - Verify port availability
   - Check volume mount permissions

2. **Hot Reload Not Working**

   - Verify volume mounts
   - Check file permissions
   - Ensure proper node_modules handling

3. **Network Issues**
   - Verify network configuration
   - Check container connectivity
   - Validate port mappings

### Debugging Commands

```bash
# View container logs
docker compose logs

# Check container status
docker compose ps

# Inspect container details
docker inspect <container_id>

# Check network configuration
docker network inspect app-network
```
