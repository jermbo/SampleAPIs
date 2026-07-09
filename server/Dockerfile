# Use Node.js 26
FROM node:26-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies for a leaner, reproducible image
RUN npm ci --omit=dev

# Copy the rest of the application
COPY . .

# Run as the built-in unprivileged user rather than root
USER node

ENV NODE_ENV=production

# Expose port 5555 (actual server port)
EXPOSE 5555

# Start the application with node (nodemon is a dev-only file watcher)
CMD ["npm", "start"]
