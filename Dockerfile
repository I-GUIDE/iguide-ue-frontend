FROM node:18-alpine as build
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
COPY ./nginx-config/fullchain.pem /etc/nginx/ssl/fullchain.pem
COPY ./nginx-config/privkey.pem /etc/nginx/ssl/privkey.pem
EXPOSE 80 443
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]