describe('Home Page', () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3001/api/v1/orders', 
    { fixture: 'orders.json'})
    .as('getOrders');
    cy.visit('http://localhost:3000/')
    cy.wait('@getOrders')
  });
  // As a user, when I navigate to the website I should see the name of the website, form to put my name, ingredient buttons, a submit button and any previous orders. 
  it('should see the order input field, ingredient buttons, previous orders and a submit button', () => {
    cy.get('h1').should('contain.text', 'Burrito Builder')
    cy.get('input[name=name]').should('have.attr', 'placeholder', 'Name')
    cy.get('form > button').should('have.length', 13)
    cy.get('[name="beans"]').contains('beans');
    cy.get('[name="sour cream"]').contains('sour cream');

    cy.get('form > p').contains('Order: Nothing selected')

    cy.get('.order').should('have.length', 2);
    cy.get(':nth-child(1) > h3').should('contain', 'Larry');
    cy.get(':nth-child(1) > .ingredient-list > :nth-child(1)').should('contain', 'beans');
    cy.get(':nth-child(1) > .ingredient-list > :nth-child(2)').should('contain', 'rice');
    cy.get(':nth-child(1) > .ingredient-list > :nth-child(3)').should('contain', 'cheese');
  
    cy.get(':nth-child(2) > h3').should('contain', 'Tayyar');
    cy.get(':nth-child(2) > .ingredient-list > :nth-child(1)').should('contain', 'steak');
    cy.get(':nth-child(2) > .ingredient-list > :nth-child(2)').should('contain', 'lettuce');
    cy.get(':nth-child(2) > .ingredient-list > :nth-child(3)').should('contain', 'pico de gallo');
  })
})