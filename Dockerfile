# Use a base image with Node.js pre-installed
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Install TypeScript globally
RUN npm install -g typescript

# Install ts-node globally
RUN npm install -g ts-node

# Copy the build folder
COPY dist ./dist

# Copy the .env file
COPY .env .env

# Expose the necessary port(s)
EXPOSE 3001

# Run the application
CMD ["npm", "start"]
