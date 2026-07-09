# Use Node.js 26
FROM node:26-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port 5555 (actual server port)
EXPOSE 5555

# Start the application in development mode
CMD ["npm", "run", "server"]
