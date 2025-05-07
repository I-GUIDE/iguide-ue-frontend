const prerender = require("prerender");
const server = prerender({
  chromeLocation: "/usr/bin/google-chrome-stable",
  // chromeLocation: "/usr/bin/google-chrome",
});

server.start();
