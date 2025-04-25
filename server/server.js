const prerender = require("prerender");
const server = prerender({
  chromeLocation: "/usr/bin/google-chrome",
  chromeFlags: [
    "--no-sandbox",
    "--headless",
    "--disable-gpu",
    "--remote-debugging-port=9222",
  ],
});
server.start();
