FROM node:20-slim

# Set working directory
WORKDIR /app

# Install necessary dependencies
RUN apt-get update && apt-get install -y openssl libssl-dev

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Generate Prisma client
COPY prisma ./prisma
RUN npx prisma generate

# Copy application files
COPY . .

# Set environment variables
COPY .env ./

# Expose application port
EXPOSE 3000

# Start application
CMD ["npx", "nodemon", "--legacy-watch", "index.js"]
