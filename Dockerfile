FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build

# Use Nginx as the production server
FROM nginx:latest as prod
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy SSL certificates from the host
COPY /etc/letsencrypt/live/dev.i-guide.io/fullchain.pem /etc/nginx/ssl/fullchain.pem
COPY /etc/letsencrypt/live/dev.i-guide.io/privkey.pem /etc/nginx/ssl/privkey.pem
EXPOSE 80 443
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]