FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY packages ./packages
COPY apps/clients_app ./apps/clients_app

RUN npm install
WORKDIR /app/apps/clients_app
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]