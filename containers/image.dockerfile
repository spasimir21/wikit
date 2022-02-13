FROM node:14.12.0-alpine

WORKDIR /wikit

COPY ./package-lock.json ./package-lock.json
COPY ./package.json ./package.json

RUN npm install

COPY ./tsconfig.build.json ./tsconfig.build.json
COPY ./tsconfig.json ./tsconfig.json

COPY ./nest-cli.json ./nest-cli.json
COPY ./config.yml ./config.yml

COPY ./libs ./libs
COPY ./apps/image ./apps/image

CMD ["npm", "run", "start", "image"]
