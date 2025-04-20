FROM node:slim

WORKDIR /server
COPY . .

RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      wget \
      ca-certificates \
      fonts-liberation \
      libasound2 \
      libatk1.0-0 \
      libcups2 \
      libdbus-1-3 \
      libgtk-3-0 \
      libnspr4 \
      libnss3 \
      libx11-xcb1 \
      libxcomposite1 \
      libxdamage1 \
      libxkbcommon0 \
      libxrandr2 \
      libxss1 \
      libxtst6 \
 && wget -qO /usr/share/keyrings/google-linux-signing-keyring.gpg \
      https://dl.google.com/linux/linux_signing_key.pub \
 && echo \
   "deb [arch=amd64 signed-by=/usr/share/keyrings/google-linux-signing-keyring.gpg] \
    http://dl.google.com/linux/chrome/deb/ stable main" \
    > /etc/apt/sources.list.d/google-chrome.list \
 && apt-get update \
 && apt-get install -y --no-install-recommends google-chrome-stable \
 && rm -rf /var/lib/apt/lists/*

RUN yarn install --frozen-lockfile

ENV CHROME_BIN=/usr/bin/google-chrome-stable

EXPOSE 3000
CMD ["node", "server.js"]
