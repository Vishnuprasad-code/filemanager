# Use the official Node.js image
FROM node:18-alpine as build-step

# Set the working directory in the container
WORKDIR /app/frontend

# Copy package.json and package-lock.json to install dependencies
COPY ./package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

RUN npm run build


# Build step #2: build an nginx container
FROM nginx:stable-alpine
COPY --from=build-step /app/frontend/dist /usr/share/nginx/html
COPY deployment/nginx.default.conf /etc/nginx/conf.d/default.conf