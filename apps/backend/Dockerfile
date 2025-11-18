FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
WORKDIR /app/apps/backend
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "start:prod"]