# Fetching the minified node image on apline linux
FROM node:slim

# Setting up the work directory
WORKDIR /auth

# Copying all the files in our project
COPY . .

# Installing dependencies
RUN yarn install

# Starting our application
CMD [ "npx", "nodemon", "-r", "dotenv/config", "auth_server.js" ]

# Exposing server port
EXPOSE 3000 8443