FROM node:20-alpine

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source
COPY . .

# Build TypeScript to Javascript
RUN npm run build

# Expose the backend port
EXPOSE 5001

# Start the server
CMD ["npm", "start"]
