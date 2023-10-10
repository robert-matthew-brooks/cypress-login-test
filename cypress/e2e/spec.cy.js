const baseUrl = Cypress.config().baseUrl;
const validUsername = 'standard_user';
const validPassword = 'secret_sauce';

Cypress.Commands.add('login', (username, password) => {
  if (username) cy.get('#user-name').type(username);
  if (password) cy.get('#password').type(password);
  cy.get('#login-button').click();
});

describe('login page', () => {
  it('should display login form elements', () => {
    cy.visit('/');
    cy.get('#user-name');
    cy.get('#password');
    cy.get('#login-button');
  });

  describe('redirect', () => {
    it('should log in and redirect to the inventory page with correct account details', () => {
      cy.visit('/').login(validUsername, validPassword);
      cy.url().should('eq', `${baseUrl}/inventory.html`);
      cy.get('#logout_sidebar_link');
    });

    it('should not log in or redirect with invalid username', () => {
      cy.visit('/').login('invalid_username', validPassword);
      cy.url().should('eq', `${baseUrl}/`);
    });

    it('should not log in or redirect with invalid password', () => {
      cy.visit('/').login(validUsername, 'invalid_password');
      cy.url().should('eq', `${baseUrl}/`);
    });

    it('should not allow access to the inventory page before the user has logged in', () => {
      cy.visit('/inventory.html', { failOnStatusCode: false });
      cy.url().should('not.eq', `${baseUrl}/inventory.html`);
    });
  });
});
