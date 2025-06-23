FROM node:18-alpine

WORKDIR /usr/src/app

# ✅ Set this BEFORE copying package.json to apply during npm install
ENV HUSKY=0

# Copy only package files first to cache dependencies
COPY package*.json ./

# Install production dependencies
RUN npm install --only=production

# Copy the rest of the application code
COPY . .

CMD ["node", "index.js"]
