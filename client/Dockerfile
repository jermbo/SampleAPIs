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
