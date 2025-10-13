# DEVELOPMENT STAGE
FROM node:22-alpine AS development

WORKDIR /app

COPY --chown=node:node package*.json ./

USER node
RUN npm ci

EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# --- BUILD STAGES ---
FROM node:22-alpine AS build

WORKDIR /app

COPY --chown=node:node --from=development /app/package*.json ./
COPY --chown=node:node --from=development /app/node_modules ./node_modules
COPY --chown=node:node . .

USER node
RUN npm run build

ENV NODE_ENV=production
RUN npm ci --only=production && npm cache clean --force

# --- PRODUCTION STAGES ---
FROM node:22-alpine AS production

USER node
WORKDIR /app

COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist

CMD ["node", "dist/main.js"]