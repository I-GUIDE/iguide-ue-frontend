const { defineConfig } = require("cypress");

module.exports = defineConfig({
  // projectId: "",
  clientCertificates: [
    {
      url: "https://localhost",
      certs: [
        {
          cert: "./nginx-config/fullchain.pem",
          key: "./nginx-config/privkey.pem",
        },
      ],
    },
  ],

  chromeWebSecurity: false,

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
