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
EXPOSE 80/tcp
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]