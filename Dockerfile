FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build

# Use Nginx as the production server
FROM nginx:latest as prod
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx-config/nginx.conf /etc/nginx/conf.d/default.conf
# Copy SSL certificates from the host
# NOTE: Make sure the location has the latest .pem files
COPY ./nginx-config/fullchain.pem /etc/nginx/ssl/fullchain.pem
COPY ./nginx-config/privkey.pem /etc/nginx/ssl/privkey.pem
COPY ./nginx-config/ip-list.d/ip-list*.conf /etc/nginx/
EXPOSE 80 443
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]