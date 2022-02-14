FROM node:14.12.0-alpine

WORKDIR /wikit

COPY ./package-lock.json ./package-lock.json
COPY ./package.json ./package.json

RUN npm install

CMD ["npm", "run", "start:dev", "image"]
