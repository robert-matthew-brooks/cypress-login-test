const baseUrl = Cypress.config().baseUrl;
const validUsername = 'standard_user';
const validPassword = 'secret_sauce';

Cypress.Commands.add('login', (username, password) => {
  if (username) cy.get('#user-name').type(username);
  if (password) cy.get('#password').type(password);
  cy.get('#login-button').click();
});

describe('login page', () => {
  describe('form elements', () => {
    it('should display login form elements', () => {
      cy.visit('/');
      cy.get('#user-name');
      cy.get('#password');
      cy.get('#login-button');
    });

    it('should not display the password on screen', () => {
      cy.visit('/');
      cy.get('#password').invoke('attr', 'type').should('eq', 'password');
    });
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

  describe('cookies', () => {
    it('should create a session cookie with username on successful login', () => {
      cy.visit('/').login(validUsername, validPassword);
      cy.getCookie('session-username').its('value').should('eq', validUsername);
    });

    it('should remove the cookie on logout', () => {
      cy.visit('/').login(validUsername, validPassword);
      cy.get('#react-burger-menu-btn').click();
      cy.get('#logout_sidebar_link').click();
      cy.getCookie('session-username').should('not.exist');
    });
  });

  describe('validation failure feedback', () => {
    it('should not show any errors before user input', () => {
      cy.visit('/');
      cy.get('#user-name').should('not.have.class', 'error');
      cy.get('#password').should('not.have.class', 'error');
      cy.get('.error-message-container').children().should('have.length', 0);
    });

    it('should provide feedback when account details are invalid', () => {
      cy.visit('/').login('invalid_username', 'invalid_password');
      cy.get('#user-name').should('have.class', 'error');
      cy.get('#password').should('have.class', 'error');
      cy.get('.error-message-container')
        .children()
        .should('have.length.greaterThan', 0);
    });

    it('should prompt user when no username is provided', () => {
      cy.visit('/').login('', validPassword);
      cy.contains('Username is required');
    });

    it('should prompt user when no username is provided', () => {
      cy.visit('/').login(validUsername, '');
      cy.contains('Password is required');
    });
  });
});
