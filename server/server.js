const prerender = require("prerender");
const server = prerender({
  chromeLocation: process.env.CHROME_BIN || "/usr/bin/google-chrome", // Fallback to default if not set
  chromeFlags: [
    "--no-sandbox",
    "--headless",
    "--disable-gpu",
    "--remote-debugging-port=9222",
  ],
});

server.start();
