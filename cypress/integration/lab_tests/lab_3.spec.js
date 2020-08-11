describe('Lab 3', () => {
  it('Successfully loads with valid HTML', () => {
    cy.fixture('test_values').then((json) => {
      const labUrl = `${json.test_context || ''}/lab_3/`;
      cy.visit(labUrl); // change URL to match your dev URL
      cy.htmlvalidate();
    });
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

  it('The aside block should be correctly structured with four images and their links', () => {
    cy.get('.aside a')
      .should('have.length', 4);

    cy.get('.aside a img')
      .should('have.length', 4);

    cy.get('.aside h2')
      .should('have.length', 1)
      .contains('Favourite photos');
  });

  it('All images should have descriptive alt text', () => {
    cy.get('.aside')
      .find('img')
      .should('have.length', 4)
      .each(($i) => {
        cy.log($i);
        expect($i).to.have.attr('alt');
        const alt = Cypress.$($i).attr('alt');
        expect(alt.length).to.be.greaterThan(0);
        expect(alt.length).to.be.lessThan(140);
      });
  });

  it('Should display valid images', () => {
    cy.get('.aside')
      .find('img')
      .should('have.length', 4)
      .should('be.visible')
      .each(($i) => {
        expect($i[0].naturalWidth, 'Your image link is broken! Try fixing your <img> src').to.be.greaterThan(0);
        expect($i[0].naturalWidth).to.be.lessThan(481);
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