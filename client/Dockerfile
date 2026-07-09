# Use Node.js 26
FROM node:26-alpine

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

ENV NODE_ENV=production

# Expose port 4444
EXPOSE 4444

# Serve the production build (vite preview) rather than the dev server.
CMD ["npm", "run", "preview", "--", "--host", "--port", "4444"]
