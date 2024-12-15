# Step 1: Use an official node image as the base image
FROM node:18 AS build

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (or yarn.lock) to the container
COPY package*.json ./

# Step 4: Install dependencies inside the container
RUN npm install

# Step 5: Copy the rest of the application files into the container
COPY . .

# Step 6: Build the app for production
RUN npm run build

# Step 7: Use an nginx image to serve the built React app
FROM nginx:alpine

# Step 8: Copy the build output to the nginx directory
COPY --from=build /app/dist /usr/share/nginx/html

# Step 9: Expose port 80 (default port for nginx)
EXPOSE 80

# Step 10: Start nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]
