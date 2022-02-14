FROM nginx:1.21.6-alpine

COPY ./containers/nginx/config /etc/nginx/conf.d

COPY ./frontend/dist /usr/share/nginx/html
