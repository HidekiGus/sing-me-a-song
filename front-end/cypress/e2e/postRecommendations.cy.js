describe('Tests POST /recommendations', () => {
  it('Tests if it adds a valid recommendation', async () => {
    cy.visit('http://localhost:3000');

    cy.get('#data-name').type("oai");
    cy.get("#data-link").type("https://www.youtube.com/randomlink");

    cy.intercept('POST', 'http://localhost:4000/').as('newRecommendation');

    cy.get("#data-button-create-recommendation").click();

    cy.wait('@newRecommendation');

    cy.expect('@newRecommendation').its('response.status').should('include', 201)
  })
})