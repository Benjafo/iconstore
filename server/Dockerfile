FROM node:22.17.0-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for development)
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "run", "dev"]