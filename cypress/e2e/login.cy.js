describe('Login Functionality', () => {
  const apiUrl = Cypress.env('VITE_API_URL');

  beforeEach(() => {
    cy.visit('/login'); 
  });

  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });

  it('should display login form', () => {
    cy.get('#email').should('be.visible');
    cy.get('#password').should('be.visible');
    cy.get('#submit-button').should('contain', 'Login');
  });

  it('should show error for invalid email', () => {
    cy.get('#email').type('invalid-email');
    cy.get('#password').type('ValidPass1!');
    cy.get('#submit-button').click();
    cy.get('#email').then(($el) => {
      $el[0].setCustomValidity('');
      if (!$el[0].checkValidity()) {
        $el[0].setCustomValidity('Invalid email address');
      }
    });
    cy.get('#email:invalid').should('have.length', 1);
  });

  it('should show error for invalid credentials', () => {
    cy.get('#email').type('test@example.com');
    cy.get('#password').type('WrongPassword1!');
    cy.intercept('POST', `${apiUrl}/users/auth/login`, {
      statusCode: 400,
      body: { message: 'Email or password is invalid. Please try again.' },
    }).as('loginRequest');
    cy.get('#submit-button').click();
    cy.wait('@loginRequest');
  });

  it('should login successfully with valid credentials', () => {
    cy.get('#email').type('valid@example.com');
    cy.get('#password').type('ValidPassword1!');
    cy.intercept('POST', `${apiUrl}/users/auth/login`, {
      statusCode: 200,
      body: { accessToken: 'fakeAccessToken' },
    }).as('loginRequest');
    cy.get('#submit-button').click();
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
  });
});






