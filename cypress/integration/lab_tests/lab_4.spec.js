describe('Lab 4', () => {
  it('Successfully loads with valid HTML', () => {
    cy.fixture('test_values').then((json) => {
      const labUrl = `${json.test_context || ''}/lab_4/`;
      cy.visit(labUrl); // change URL to match your dev URL
      cy.htmlvalidate();
    });
  });

  it('Should contain a copy of the lab CSS file', () => {});
  it('Should include an HTML form', () => {
    cy.get('form');
  });

  it('Should include a Textarea field that has 5 rows and 33 columns', () => {
    cy.get('form textarea')
      .then(($ta) => {
        const rows = Number($ta.attr('rows'));
        const cols = Number($ta.attr('cols'));

        expect(rows).to.be.greaterThan(4);
        expect(cols).to.be.greaterThan(32);
      });
    //   .should('have.attr', 'rows', ($ta) => {
    // //   });
    // '

    // ', ($txt) => {
    //     expect($txt).to.have
    // })
    //   .should('be.gt', 4)
  });

  it('Should have an input field for text, with an attached label element', () => {
    cy.get('form input[type=text]')
      .its('name')
      .then(($name) => {
        cy.get('form label')
          .its('for')
          .then(($for) => {
            expect($for).equals($name);
          });
      });
  });

  //   it('Should POST on submit to the /api endpoint', () => {});

//   it('Should receive a reply from the server', () => {});
});