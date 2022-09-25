beforeEach(() => {
  cy.resetDatabase();
})

const frontUrl = 'http://localhost:3000';

describe('Tests POST /recommendations', () => {
  it('Tests if it adds a valid recommendation', async () => {
    cy.visit(frontUrl);
    cy.get('#data-name').type('Testing recommendation');
    cy.get('#data-link').type('https://www.youtube.com/test');
    cy.intercept('POST', 'http://localhost:4000/').as('newRecommendation');
    cy.get('#data-button-create-recommendation').click();
    cy.wait('@newRecommendation');
    cy.get('#data-recommendation').should('exist');
  });

  it('Tests if it alerts when trying to create a recommendation without name', () => {
    cy.visit(frontUrl);
    cy.get('#data-link').type('https://www.youtube.com/test');
    cy.intercept('POST', 'http://localhost:4000/').as('newRecommendation');
    cy.get('#data-button-create-recommendation').click();

    cy.on('window:alert', (text) => {
      expect(text).to.contains('Error creating recommendation!');
    });
  });

  it('Tests if it alerts when trying to create a recommendation without link', () => {
    cy.visit(frontUrl);
    cy.get('#data-name').type('Testing recommendation');
    cy.intercept('POST', 'http://localhost:4000/').as('newRecommendation');
    cy.get('#data-button-create-recommendation').click();

    cy.on('window:alert', (text) => {
      expect(text).to.contains('Error creating recommendation!');
    });
  });

  it('Tests if it alerts when trying to create a recommendation with a link that is not from youtube', () => {
    cy.visit(frontUrl);
    cy.get('#data-link').type('https://www.globo.com/test');
    cy.intercept('POST', 'http://localhost:4000/').as('newRecommendation');
    cy.get('#data-button-create-recommendation').click();

    cy.on('window:alert', (text) => {
      expect(text).to.contains('Error creating recommendation!');
    });
  });

  it('Tests if it upvotes an existing recommendation', () => {
    cy.visit(frontUrl);
    cy.addRecommendation();
    cy.get('#data-upvote').click();
    cy.get('#data-score').should('contain', '1');
    cy.get('#data-upvote').click();
    cy.get('#data-score').should('contain', '2');
  });

  it('Tests if it downvotes an existing recommendation and keeps it if the score is higher than -5', () => {
    cy.visit(frontUrl);
    cy.addRecommendation();
    cy.get('#data-downvote').click();
    cy.get('#data-score').should('contain', '-1');
    cy.get('#data-recommendation').should('exist');
  })

  it('Tests if it downvotes an existing recommendation and removes it if the score gets below -5', () => {
    cy.visit(frontUrl);

    cy.addRecommendation();

    cy.get('#data-downvote').click();
    cy.get('#data-score').should('contain', '-1');
    cy.get('#data-downvote').click();
    cy.get('#data-score').should('contain', '-2');
    cy.get('#data-downvote').click();
    cy.get('#data-score').should('contain', '-3');
    cy.get('#data-downvote').click();
    cy.get('#data-score').should('contain', '-4');
    cy.get('#data-downvote').click();
    cy.get('#data-score').should('contain', '-5');
    cy.get('#data-recommendation').should('exist');
    cy.get('#data-downvote').click();
    cy.get('#data-recommendation').should('not.exist');
  });

  it('Tests if recommendations on "/" route are visible', () => {
    cy.visit(frontUrl);
    cy.addRecommendation();
    cy.get('#data-recommendation').should('be.visible');
  });

  it('Tests if recommendations on "/top" route are visible', () => {
    cy.addRecommendation();
    cy.addRecommendation();
    cy.visit(`${frontUrl}/top`);
    cy.get('#data-recommendation').should('be.visible');
  });

  it('Tests if recommendations on "/random" route are visible', () => {
    cy.addRecommendation();
    cy.addRecommendation();
    cy.visit(`${frontUrl}/random`);
    cy.get('#data-recommendation').should('be.visible');
  });
});