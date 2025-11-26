FROM node:20-alpine
WORKDIR /app
COPY package*.json turbo.json ./
COPY packages ./packages
COPY apps/core_microservice ./apps/core_microservice
RUN npm install
WORKDIR /app/apps/core_microservice
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "start:prod"]