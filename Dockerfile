# Use an official Node.js LTS image for better stability and security
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json before copying the rest of the code
COPY package*.json ./

# Install dependencies using production flag for a smaller image
RUN npm install --only=production

# Copy the remaining application source code
COPY . .

# Expose the port the application listens on
EXPOSE 6000

# Use a more reliable command to start the server
CMD ["npx", "json-server", "--watch", "db.json", "--port", "5000"]
