# # Stage 1 : Build React
# FROM node:20-alpine AS builder

# WORKDIR /app

# # dependencies
# COPY package.json package-lock.json ./

# # cleaner node_modules
# RUN npm ci

# # source code
# COPY . .

# # build project
# RUN npm run build


# # Stage 2 : Nginx
# FROM nginx:alpine

# # remove default config
# RUN rm /etc/nginx/conf.d/default.conf

# # using our config
# COPY Nginx/nginx.conf /etc/nginx/conf.d/default.conf

# COPY Nginx/ssl /etc/nginx/ssl

# # copy build files from builder
# COPY --from=builder /app/dist /usr/share/nginx/html

# EXPOSE 80
# EXPOSE 443

# CMD ["nginx", "-g", "daemon off;"]


# for development
FROM node:20-alpine

WORKDIR /app

# dependencies
COPY package.json package-lock.json ./

# cleaner node_modules
RUN npm ci

# source code
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
