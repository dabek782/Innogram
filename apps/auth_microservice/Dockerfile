FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install

WORKDIR /app/apps/auth_microservice

RUN npm run build

EXPOSE 3002

CMD ["npm", "run", "start:prod"]