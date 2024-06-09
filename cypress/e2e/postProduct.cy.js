describe('Post Product Functionality', () => {
  const apiUrl = Cypress.env('VITE_API_URL');

  beforeEach(() => {
    // Log in before each test
    cy.request('POST', `${apiUrl}/users/auth/login`, {
      email: 'serega@gmail.com',
      password: '123',
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      const token = resp.body.accessToken;
      window.localStorage.setItem('token', token);
      cy.log(`Login successful, token set: ${token}`);
      
      // Mock TokenManager methods
      cy.window().then((win) => {
        win.TokenManager = {
          isAuthenticated: () => true,
          getUserRole: () => 'USER'
        };
      });
    });

    // Visit the post product page
    cy.visit('/postproduct');
    cy.url().should('include', '/postproduct');
  });

  it('should fill out and submit the product form successfully', () => {
    // Intercept the product creation request
    cy.intercept('POST', `${apiUrl}/products`).as('createProductRequest');

    // Fill out the product name
    cy.get('#product-name-input').type('Test Product Name');

    // Select a category
    cy.get('#category-select').select('1'); // Assuming '1' is the value of a valid category

    // Wait for the attributes to be populated and fill out each attribute
    cy.get('.content-block input[type="text"]').each(($el, index) => {
      cy.wrap($el).type(`Attribute ${index + 1} Value`);
    });

    // Fill out the description
    cy.get('#description-input').type('This is a test product description.');

    // Fill out the price
    cy.get('#price-input').type('100');

    // Select a district
    cy.get('#district-select').select('1'); // Assuming '1' is the value of a valid district

    // Select a city
    cy.get('#city-select').select('1'); // Assuming '1' is the value of a valid city

    // Fill out the contact person
    cy.get('#contact-person-input').type('Test Contact Person');

    // Fill out the email
    cy.get('#email-input').type('test@example.com');

    // Fill out the phone number
    cy.get('#phone-number-input').type('1234567890');

    // Submit the form
    cy.get('#submit-button').click();

    // Wait for the product creation request to complete
    cy.wait('@createProductRequest').then((interception) => {
      // Ensure the request was successful
      expect(interception.response.statusCode).to.eq(201);
    });
  });
});

