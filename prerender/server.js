const prerender = require("prerender");
const server = prerender({
  chromeLocation: "/usr/bin/google-chrome-stable",
  port: 8000,
});

server.start();
