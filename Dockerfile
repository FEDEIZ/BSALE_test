# Use a base image with Node.js pre-installed
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install ts-node globally
RUN npm install -g ts-node

# Install dependencies
RUN npm install


COPY . .

# Copy the .env file
COPY .env .env

# Expose the necessary port(s)
EXPOSE 3001

# Run the application
CMD ["npm", "start"]
