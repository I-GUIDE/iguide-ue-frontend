const prerender = require("prerender");

const server = prerender({
  followRedirects: true,
  chromeLocation: "/usr/bin/google-chrome",
  chromeFlags: [
    "--no-sandbox",
    "--headless",
    "--disable-gpu",
    "--remote-debugging-port=9222",
    "--hide-scrollbars",
  ],
  port: 8000,
});
server.use(require("prerender-memory-cache"));
server.start();
