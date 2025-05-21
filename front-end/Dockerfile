# Stage 1: Build the application
FROM node:18.17.1-alpine AS builder

# Set environment variables
ENV NODE_ENV=production

# Set working directory inside the container
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache python3 make g++

# Copy package files and install dependencies
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install --legacy-peer-deps

# Copy the entire project
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Production environment
FROM node:18.17.1-alpine

# Set environment variables
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Copy necessary build files from the builder stage
COPY --from=builder /app/next.config.mjs .
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose the port Next.js runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
