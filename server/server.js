const prerender = require("prerender");
const server = prerender({
  // point directly at the real binary
  chromeLocation: process.env.CHROME_BIN,
  chromeFlags: [
    "--no-sandbox",
    "--headless",
    "--disable-gpu",
    "--remote-debugging-port=9222",
  ],
});
server.start();
