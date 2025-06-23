# Use Node base image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Set ENV to disable Husky
ENV HUSKY=0

# Copy only package.json files
COPY package*.json ./

# ✅ Remove prepare script dynamically before install
RUN npm pkg delete scripts.prepare

# Now install only production dependencies
RUN npm install --only=production

# Copy the rest of the app
COPY . .

CMD ["node", "index.js"]
