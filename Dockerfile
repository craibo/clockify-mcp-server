FROM node:20.17.0-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json yarn.lock ./

# Install dependencies (including dev dependencies for build)
RUN npm install

# Copy source code and tsconfig
COPY tsconfig.json ./
COPY src/ ./src/

# Build the Typescript code
RUN npx tsc

# The server communicates over stdio, so no ports need to be exposed

# Start the server using the compiled JavaScript code
CMD ["node", "src/index.js"]
