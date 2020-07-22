function headAndBodyCheck(str) {
  return str.includes("element-required-content");
}

describe("Lab 2", () => {
  const labUrl = "/answer_key/lab_2/";
  // TODO: WRITE OUT VALIDATION ERRORS IN A LEGIBLE FORMAT
  // Guidelines: https://docs.cypress.io/api/cypress-api/cypress-log.html#Examples\

  it("Successfully loads with valid HTML", () => {
    cy.visit(labUrl); // change URL to match your dev URL
    cy.htmlvalidate();
  });

  it("Has meta content to reflect the page author", () => {
    cy.fixture("test_values").then((json) => {
      cy.get('meta[name="author"]')
        .should(
          "have.attr",
          "name",
          "author"
        )
        .should(
          "have.attr",
          "content",
          json.name
        )
      });
  });

  it("Contains the correct number of address blocks", () => {
    cy.get("address")
    .should("have.length", 2)
  });

  it("Address blocks contain links for contact information", () => {
    let addressCheck = cy.get("address a");
    addressCheck.should("have.length", 2)
    addressCheck.each(($el, i) => {
      expect($el).to.exist;
      expect($el).to.have.attr('href');
      if(i === 0){
        expect($el).to.have.attr('href').match(/tel:/g);
      } else {
        expect($el).to.have.attr('href').match(/mailto:/g);
      }
    })
    
    addressCheck.first()
    .should('have.attr', 'href')

    // addressCheck.last().should('have.attr', 'href')
  })

  // it("Address block contains a telephone link", () => {
  //   cy.get("address a")
  //     .its('href')
  // });

  it("Address block contains a mailto link");
  it("Contains appropriate use of strong tags in address block");
  it("Contains a datetime stamp within a paragraph");

  it("Contains a top-level page header");
  it("Contains at least two secondary page headers");
  it("Contains an unordered list with three dateTimes");

  it("Contains an ordered list with three sub-entries");
  it("Uses supertext and subtext tags appropriately");
  it("Uses abbreviation tags appropriately");

  it("Uses supertext and subtext tags appropriately");
  it("Uses an emphasis tag appropriately");

  it("Contains a definition list");
  it("Has correctly structured definition list headers");
  it("Has correctly structured definition list content");

  it("Has a correctly-formatted link to a research page");

  it("Contains a blockquote footer");

  it("Uses paragraph tags to structure all loose page text");
});
