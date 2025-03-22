describe("Contact page tests", () => {
  before(() => {
    cy.visit("https://localhost:443/contact-us");
  });

  it("Fails to submit with empty fields", () => {
    cy.contains("button", "Submit").click();

    // Assertions for validation messages (one approach for each field):
    cy.get('input[placeholder="Name"]').should("have.attr", "required"); // Check for the 'required' attribute
    cy.get('input[placeholder="Name"]:invalid').should("be.visible"); // Check if the field is invalid and visible
    cy.wait(1000);
    cy.get('input[placeholder="Name"]').type("Test user");

    cy.contains("button", "Submit").click();

    cy.get('input[placeholder="Email"]').should("have.attr", "required");
    cy.get('input[placeholder="Email"]:invalid').should("be.visible");
    cy.wait(1000);
    cy.get('input[placeholder="Email"]').type("testuser@example.com");

    cy.contains("button", "Submit").click();

    cy.get('textarea[placeholder="Your message"]').should(
      "have.attr",
      "required"
    );
    cy.get('textarea[placeholder="Your message"]:invalid').should("be.visible");
  });

  it("Sends a text message to Slack", () => {
    cy.visit("https://localhost:443/contact-us");

    cy.get('input[placeholder="Name"]').type("Test user");
    cy.get('input[placeholder="Email"]').type("testuser@example.com");

    cy.get('textarea[placeholder="Your message"]').type("test message");
    cy.contains("button", "Submit").click();
    cy.wait(2000);
    cy.get('div[role="alert"]')
      .find("div")
      .find("div")
      .should("have.text", "Success");
  });

  it("Inputs 1 image", () => {
    cy.visit("https://localhost:443/contact-us");

    cy.get("input[type=file]").selectFile(
      ["public/default-images/dataset.png"],
      { force: true }
    );
    cy.wait(1000);
    cy.get('img[alt="thumbnail-preview"]').should("have.length", 1);
  });

  it("Removes 1 image", () => {
    cy.visit("https://localhost:443/contact-us");

    cy.get("input[type=file]").selectFile(
      ["public/default-images/dataset.png"],
      { force: true }
    );
    cy.wait(1000);

    cy.get('img[alt="thumbnail-preview"]').click();
    cy.get('img[alt="thumbnail-preview"]').should("not.exist");
  });

  it("Inputs 5 images", () => {
    cy.visit("https://localhost:443/contact-us");

    cy.get("input[type=file]").selectFile(
      [
        "public/default-images/dataset.png",
        "public/default-images/notebook.png",
        "public/default-images/oer.png",
        "public/default-images/publication.png",
        "public/default-images/dataset.png",
      ],
      { force: true }
    );
    cy.wait(1000);
    cy.get('img[alt="thumbnail-preview"]').should("have.length", 5);
  });

  it("Removes 5 images", () => {
    cy.visit("https://localhost:443/contact-us");

    cy.get("input[type=file]").selectFile(
      [
        "public/default-images/dataset.png",
        "public/default-images/notebook.png",
        "public/default-images/oer.png",
        "public/default-images/publication.png",
        "public/default-images/dataset.png",
      ],
      { force: true }
    );
    cy.wait(1000);
    cy.get('img[alt="thumbnail-preview"]').should("have.length", 5);

    cy.get('img[alt="thumbnail-preview"]').each(() => {
      cy.get('img[alt="thumbnail-preview"]').first().click({ force: true });
    });

    cy.get('img[alt="thumbnail-preview"]').should("not.exist");
  });

  it("Inputs 5 images, then 1 more - error", () => {
    cy.visit("https://localhost:443/contact-us");

    cy.get("input[type=file]").selectFile(
      [
        "public/default-images/dataset.png",
        "public/default-images/notebook.png",
        "public/default-images/oer.png",
        "public/default-images/publication.png",
        "public/default-images/dataset.png",
      ],
      { force: true }
    );
    cy.wait(1000);

    cy.get("input[type=file]").selectFile(
      ["public/default-images/dataset.png"],
      { force: true }
    );

    cy.on("window:alert", (alert) => {
      expect(alert).to.contains("You can upload only up to 5 images");
    });
    cy.get('img[alt="thumbnail-preview"]').should("have.length", 5);
  });

  it("Inputs 6 images - error", () => {
    cy.visit("https://localhost:443/contact-us");

    cy.get("input[type=file]").selectFile(
      [
        "public/default-images/dataset.png",
        "public/default-images/notebook.png",
        "public/default-images/oer.png",
        "public/default-images/publication.png",
        "public/default-images/dataset.png",
        "public/default-images/dataset.png",
      ],
      { force: true }
    );
    cy.wait(1000);

    cy.get("input[type=file]").selectFile(
      ["public/default-images/dataset.png"],
      { force: true }
    );

    cy.on("window:alert", (alert) => {
      expect(alert).to.contains("You can upload only up to 5 images");
    });
  });

  // it("Sends 2 images to Slack", () => {
  //   cy.visit("https://localhost:443/contact-us");

  //   cy.get("input[type=file]").selectFile(
  //     [
  //       "public/default-images/dataset.png",
  //       "public/default-images/notebook.png",
  //     ],
  //     { force: true }
  //   );
  //   cy.wait(1000);
  //   cy.get('img[alt="thumbnail-preview"]').should("have.length", 2);

  //   cy.get('input[placeholder="Name"]').type("Test user");
  //   cy.get('input[placeholder="Email"]').type("testuser@example.com");

  //   cy.get('textarea[placeholder="Your message"]').type("test message");
  //   cy.contains("button", "Submit").click();
  //   cy.wait(5000);
  //   cy.get('div[role="alert"]')
  //     .find("div")
  //     .find("div")
  //     .should("have.text", "Success");
  // });
});
