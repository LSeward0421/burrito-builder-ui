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
    cy.get(':nth-child(1) > .ingredient-list > :nth-child(3)').should('contain', 'queso fresco');
  
    cy.get(':nth-child(2) > h3').should('contain', 'Tayyar');
    cy.get(':nth-child(2) > .ingredient-list > :nth-child(1)').should('contain', 'steak');
    cy.get(':nth-child(2) > .ingredient-list > :nth-child(2)').should('contain', 'lettuce');
    cy.get(':nth-child(2) > .ingredient-list > :nth-child(3)').should('contain', 'pico de gallo');
  })

  // As a user, when I add my name, select ingredients and click submit order, I should see my new order on the screen with the correct information. 

  it('should be able to submit a new order', () => {
    cy.intercept('POST', 'http://localhost:3001/api/v1/orders', { fixture: 'newOrder' }).as('postOrder');

    cy.get('.order').should('have.length', 2);

    cy.get('input[name=name]').type('Maggie');
    cy.get('[name="steak"]').click();
    cy.get('[name="beans"]').click();
    cy.get('[name="queso fresco"]').click();
    cy.get('form > p').contains('Order: steak, beans, queso fresco');
    cy.get('button').contains('Submit Order').click();
    cy.wait('@postOrder');

    cy.get('input[name=name]').should('have.value', '');
    cy.get('form > p').contains('Order: Nothing selected');
    cy.get('.order').should('have.length', 3);
    cy.get(':nth-child(3) > h3').should('contain', 'Maggie');
    cy.get(':nth-child(3) > .ingredient-list > :nth-child(1)').should('contain', 'steak');
    cy.get(':nth-child(3) > .ingredient-list > :nth-child(2)').should('contain', 'beans');
    cy.get(':nth-child(3) > .ingredient-list > :nth-child(3)').should('contain', 'queso fresco');
  });

  // As a user, when I refresh the page I should still see my previous orders. 

  it('should maintain submitted orders after page reload', () => {
    cy.intercept('GET', 'http://localhost:3001/api/v1/orders', { fixture: 'updatedOrders' }).as('updatedOrders');
    cy.intercept('POST', 'http://localhost:3001/api/v1/orders', { fixture: 'newOrder' }).as('postOrder');
    cy.get('.order').should('have.length', 2);
    cy.get('input[name=name]').type('Maggie');
    cy.get('[name="steak"]').click();
    cy.get('[name="beans"]').click();
    cy.get('[name="queso fresco"]').click();
    cy.get('form > p').contains('Order: steak, beans, queso fresco');
    cy.get('button').contains('Submit Order').click();
    cy.wait('@postOrder');

    cy.reload();
    cy.wait('@updatedOrders');
    cy.get('.order').should('have.length', 3);
  });
  
  // As a user, I should not be able to submit an order if I have not entered a name and at least one ingredient is selected. 

  it('should not be able to submit an order without a name and at least one ingredient selected', () => {
    cy.get('.order').should('have.length', 2);
    
    cy.get('[name="steak"]').click();
    cy.get('[name="beans"]').click();
    cy.get('[name="queso fresco"]').click();
    cy.get('form > p').contains('Order: steak, beans, queso fresco');
    
    cy.get('button').contains('Submit Order').click();
    
    cy.get('.order').should('have.length', 2);
  });
  
})