# Stage 1: Install dependencies only when needed
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install