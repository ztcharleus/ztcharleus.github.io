describe("Lab 1", () => {
  it("Successfully loads", () => {
    cy.visit("/answer_key/lab_1/"); // change URL to match your dev URL
  });
  it("Has a correct basic page structure", () => {
    cy.get("head");
    cy.get("body");
  });
  it("Contains a page title with your name in it", () => {
    cy.fixture("test_values").then((json) => {
      cy.get("head title").contains(json.name);
    });
  });
  it("Contains a header element with your name in it", () => {
    cy.fixture("test_values").then((json) => {
      cy.get("h1").contains(json.name);
    });
  });
  it("Contains a paragraph with lorem ipsum in it", () => {
    cy.fixture("test_values").then((json) => {
      cy.get("p").contains(json.lipsum);
    });
  });
  it("Contains an unordered list with three elements", () => {
    cy.get("ul").find("li").should("have.length", 3);
  });
  it("Contains an adorable picture, with alt text", () => {
    cy.get("img").each(($el) => {
      cy.wrap($el).should("have.attr", "alt");
    });
  });
  it("Should have an image that fits on the page nicely", () => {
    cy.get("img").its("length").should("be.lt", 480);
  });
});
