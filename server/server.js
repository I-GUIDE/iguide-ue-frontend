const prerender = require("prerender");
const server = prerender(
  {
    chromeLocation: "/usr/bin/google-chrome-stable",
    chromeFlags: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--headless",
      "--disable-gpu",
      "--remote-debugging-port=9222",
      // "--remote-debugging-address=0.0.0.0",
      "--hide-scrollbars",
      "--disable-dev-shm-usage",
    ],
  },
  { shell: true }
);

server.start();
