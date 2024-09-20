# Step 1: Use Node.js base image to build the Angular app
FROM node:16-alpine AS build

# Set the working directory in the Docker container
WORKDIR /app

# Copy package.json and package-lock.json (if present) to the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the Angular project files
COPY . .

# Build the Angular app for server-side rendering (SSR)
RUN npm run build:ssr

# Step 2: Set up the runtime environment using Node.js
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy the build output from the previous step (from the build stage)
COPY --from=build /app/dist/auth-app /app/dist/auth-app

# Install only production dependencies if needed
RUN npm install --only=production

# Expose the port where the app will run
EXPOSE 4000

# Start the SSR server using the main.server.mjs file
CMD ["node", "dist/auth-app/server/main.server.mjs"]
