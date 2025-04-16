# Fetching the minified node image on apline linux
FROM node:slim

# Install Chromium and dependencies
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends && \
    ln -s /usr/bin/chromium /usr/bin/google-chrome && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*


WORKDIR /server

# Copying all the files in our project
COPY . .

# Installing dependencies
RUN yarn install

ENV CHROME_BIN=/usr/bin/google-chrome

# Starting our application
CMD [ "node", "server.js" ]

# Exposing server port
EXPOSE 3000