const validation_storage_string = "lab_2_html";
const validation_storage = `./cypress/fixtures/${validation_storage_string}.json`;

function headAndBodyCheck(str) {
  return str.includes('element-required-content');
}

describe("Lab 2", () => {
  const val_errors = require(`../../fixtures/generated/lab_2.json`);


  it(`Should contain valid HTML, you have ${val_errors.length} known validation errors`, () => {
    expect(val_errors.length).to.equal(0);
  });

  // TODO: WRITE OUT VALIDATION ERRORS IN A LEGIBLE FORMAT
  // Guidelines: https://docs.cypress.io/api/cypress-api/cypress-log.html#Examples\



  if (val_errors.length > 0) {
    val_errors.forEach((err) => {
      const headOrBodyError = headAndBodyCheck(err);
      if(headOrBodyError) {
        it(`Must have a valid basic page structure - check your Head or Body tag`, () => {
          expect(err).to.be.undefined;
        })
      }
      // it(`HTML Validation Error ${err}`, () => {
      //   expect(err).to.be.undefined;
      // });
    });
  }

  it("Successfully loads", () => {
    cy.visit("/answer_key/lab_2/"); // change URL to match your dev URL
  });

  // it("Contains a correctly structured head and body", () => {
  //   cy.fixture("test_values").then((json) => {
  //     cy.document().its('contentType').should('eq', 'text/html');
  //     cy.document().then((doc) => {
  //       console.log(doc);
  //         expect(doc.body).to.not.undefined;
  //         expect(doc.head).to.not.undefined;
  //       });
  //   });
  // });

  it("Has meta content to reflect the page author");
  it("Has a page language set");

  it("Contains the correct number of address blocks");
  it("Address block contains a telephone link");
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
