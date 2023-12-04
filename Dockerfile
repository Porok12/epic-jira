FROM nginx:1.25-alpine-slim

WORKDIR /usr/share/nginx/html

COPY src/ .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
