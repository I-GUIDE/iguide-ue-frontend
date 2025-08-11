# Fetching the minified node image on apline linux
FROM node:20.19-slim

# Setting up the work directory
WORKDIR /app

# Copying files for yarn install
COPY package.json yarn.lock ./

# Installing dependencies
RUN yarn install

# Copying all the files in our project
COPY . .

# Starting our application
CMD [ "node", "auth_server.js" ]