FROM nginx:alpine

COPY template/ /usr/share/nginx/html/

EXPOSE 80
