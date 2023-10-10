describe('login page', () => {
  it('should display login form elements', () => {
    cy.visit('/');
    cy.get('#user-name');
    cy.get('#password');
    cy.get('#login-button');
  });
});
