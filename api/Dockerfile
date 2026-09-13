# Stage 1: Compile TypeScript
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY server.ts .
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=build /app/dist ./dist
EXPOSE 4000
CMD ["node", "dist/server.js"]