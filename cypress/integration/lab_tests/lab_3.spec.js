describe('Lab 3', () => {
  const labUrl = `${json.test_context}/lab_2/`;

  it('Successfully loads with valid HTML', () => {
    cy.visit(labUrl); // change URL to match your dev URL
    cy.htmlvalidate();
  });

  it('Should have a header block', () => {
    cy.get('div.header');
  });

  it('Should have a main block', () => {
    cy.get('div.main');
  });

  it('Should have an article block', () => {
    cy.get('div.article');
  });

  it('Should have an aside block', () => {
    cy.get('.aside');
  });

  it('The aside block should be correctly structured', () => {
    cy.get('.aside a')
      .should('have.length', 4);

    cy.get('.aside a img')
      .should('have.length', 4);

    cy.get('.aside h2')
      .should('have.length', 1)
      .contains('Favourite photos');
  });

  it('All images should have descriptive alt text', () => {
    const img = cy.get('.aside a img')
      .should('have.length', 4);
    img.forEach((i) => {
      i.should('have.attr', 'alt')
        .then((text) => {
          expect(text.length).to.not.be.greaterThan(160);
          expect(text.length).to.be.greaterThan(0);
        });
    });
  });

  it('Main block should contain some lipsum', () => {
    cy.get('.main p')
      .contains('Lorem ipsum dolor sit amet');
  });

  it('Main page should contain a top-level header tag with your name', () => {
    cy.fixture('test_values').then((json) => {
      cy.get('.header h1')
        .contains(json.name);
    });
  });

  it('Should have an updated footer with your name', () => {
    cy.fixture('test_values').then((json) => {
      cy.get('.footer').contains(json.name);
    });
    cy.get('body').not.contains('This fake website example is CC0 — any part of this code may be reused in any way you wish. Original example written by Chris Mills, 2016.');
    cy.get('body').not.contains('This website example has been written by Sam Cap, 2020');
  });
});