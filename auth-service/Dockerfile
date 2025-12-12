# Use Node 20 Alpine
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Upgrade npm to latest stable to avoid package resolution issues
RUN npm install -g npm@11.7.0

# Set registry explicitly to avoid caching issues
RUN npm config set registry https://registry.npmjs.org/

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Expose auth service port
EXPOSE 3001

# Start the service
CMD ["npm", "start"]
