FROM browserless/chrome
USER root

RUN apt-get update && apt-get install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g yarn

WORKDIR /usr/src/prerender

COPY yarn.lock package.json ./
RUN yarn install --frozen-lockfile

COPY . .

USER blessuser
EXPOSE 8000 9222
CMD ["node", "server.js"]