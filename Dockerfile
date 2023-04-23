FROM node:8.11-slim
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY.

EXPOSE 5500