FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

COPY tsconfig*.json ./

RUN npm install

COPY . .

ENV HOSTNAME="0.0.0.0"

EXPOSE 4000

CMD ["npm", "run", "dev"]