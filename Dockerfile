# Stage 1: Build the Node.js dependencies
FROM node:18-alpine AS deps
WORKDIR /opt/app
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Stage 2: Build the Strapi admin panel
FROM node:18-alpine AS builder
WORKDIR /opt/app
COPY --from=deps /opt/app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Setup the production image
FROM node:18-alpine
WORKDIR /opt/app

# Set NODE_ENV to production
ENV NODE_ENV=production

COPY --from=builder /opt/app/package.json ./package.json
COPY --from=builder /opt/app/node_modules ./node_modules
COPY --from=builder /opt/app/dist ./dist
COPY --from=builder /opt/app/database ./database
COPY --from=builder /opt/app/src ./src
COPY --from=builder /opt/app/public ./public
COPY --from=builder /opt/app/config ./config

EXPOSE 1337
CMD ["npm", "run", "start"]