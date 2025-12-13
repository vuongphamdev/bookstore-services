# ================================
# Stage 1: Base Stage (shared dependencies)
# ================================
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies for native modules (bcrypt needs these)
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# ================================
# Stage 2: Development Stage
# ================================
FROM base AS development

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy all source files
COPY . .

# Expose the application port
EXPOSE 3000

# Default command for development
CMD ["npm", "run", "dev"]

# ================================
# Stage 3: Builder Stage
# ================================
FROM base AS builder

# Install all dependencies (including devDependencies for building)
RUN npm ci

# Copy source code and TypeScript config
COPY tsconfig.json ./
COPY src ./src

# Build the TypeScript application
RUN npm run build

# ================================
# Stage 4: Production Stage
# ================================
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs \
    && adduser -S nodejs -u 1001

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy swagger documentation (needed at runtime)
COPY swagger.yaml ./

# Change ownership to non-root user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose the application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ping || exit 1

# Start the application
CMD ["node", "dist/index.js"]
