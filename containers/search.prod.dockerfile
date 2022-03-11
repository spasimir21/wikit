FROM node:14.12.0-alpine

WORKDIR /wikit

COPY ./package-lock.json ./package-lock.json
COPY ./package.json ./package.json

RUN npm install

COPY ./config.yml ./config.yml

COPY ./dist/apps/search/main.js ./main.js

CMD ["node", "./main.js"]
