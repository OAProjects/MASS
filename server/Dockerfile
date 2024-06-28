# Dockerfile

# Use an official Node.js runtime as a parent image
FROM node:22

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Install nodemon globally for development purposes
RUN npm install -g nodemon

# Copy the rest of your application code to the working directory
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to run your application using nodemon
CMD ["nodemon", "--watch", "src", "--exec", "ts-node", "src/index.ts"]
