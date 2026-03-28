FROM node:20-alpine

WORKDIR /app

# dependencies
COPY package.json package-lock.json ./

# cleaner node_modules
RUN npm ci

# source code
COPY . .

EXPOSE 5173

# build project
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]