# Docker file

# Use Node 18 alpine as parent image
FROM node:18.15.0-alpine3.17


# Change the working directory on the Docker image to /app
WORKDIR /app

# Copy package.json and package-lock.json to the /app directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install -force

# Copy the rest of project files into this image
COPY . .

# Expose application port
EXPOSE 5000

# Start the application
CMD npm start
