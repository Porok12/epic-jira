FROM node:18-alpine as builder

# Set the working directory inside the container
WORKDIR /app

COPY package*.json ./

RUN npm install --omit-dev

# Copy the rest of the application code to the working directory
COPY . .

RUN npm run build

# Use a smaller base image for the final production image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only the necessary files from the builder image
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
#COPY --from=builder /app/dist ./dist

# Expose the port that the application will run on
EXPOSE 3000

# Set the environment variable for Remix to production
ENV NODE_ENV=production

# Command to run the Remix application
CMD ["npm", "start"]
