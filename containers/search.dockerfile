FROM node:14.12.0-alpine

WORKDIR /wikit

COPY ./package-lock.json ./package-lock.json
COPY ./package.json ./package.json

RUN npm install onchange -g
RUN npm install

CMD ["onchange", "-i", "-k", "-p", "10000", "./dist/apps/search/main.js", "--", "node", "./dist/apps/search/main.js"]
