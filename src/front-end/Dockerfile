FROM node:20-alpine

WORKDIR /app

# dependencies
COPY package.json package-lock.json ./

# cleaner node_modules
RUN npm ci

# source code
COPY . .

# build project
RUN npm run build