FROM node:20-alpine

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies (ignoring native scripts to prevent platform build issues)
RUN npm install --ignore-scripts

# Copy application source
COPY . .

# Expose the Vite dev server port
EXPOSE 5173

# Start Vite server listening on all hosts so it is accessible outside the container
CMD ["npm", "run", "dev", "--", "--host"]
