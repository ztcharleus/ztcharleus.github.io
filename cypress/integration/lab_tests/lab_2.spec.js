const validation_storage_string = "lab_2_html";
const validation_storage = `./cypress/fixtures/${validation_storage_string}.json`;

before(() => {
  cy.exec("html-validate ./public/answer_key/lab_2/index.html", {
    failOnNonZeroExit: false,
  }).then((result) => {
    const splitResults = result.stdout.match(/\[\d+merror.+/g);
    const cleanResults = splitResults.map((r) => r.replace(/\[\d+m/g, ""));
    // const errors = results.match(/error/g);

    // Logging to check values for debug
    // cy.log(cleanResults.length);
    // cleanResults.forEach(e => {
    //   cy.log(e);
    // })

    const blob = cleanResults.reduce((c, i) => {
      if (i.includes("error")) {
        c.push(i);
      }
      return c;
    }, []);

    cy.writeFile(validation_storage, JSON.stringify(blob), () => {
      cy.log("file written");
      validation_errors = require(validation_storage);
    });
  });
});

const val_errors = require(`../../fixtures/lab_1_html.json`);

describe("Lab 2", () => {
  console.log('check val errors', val_errors);
  // const validation_errors = require(`../fixtures/lab_2_html.json`);
  // console.log(validation_errors);
  if (val_errors.length != -1) {
    val_errors.forEach((err) => {
      it(err, () => {
        expect(err).to.be.undefined;
      });
    });
  }

  it("Successfully loads", () => {
    cy.visit("/answer_key/lab_2/"); // change URL to match your dev URL
  });

  it("Should contain valid HTML", () => {});

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
