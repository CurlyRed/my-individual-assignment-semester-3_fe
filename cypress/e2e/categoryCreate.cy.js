describe('Category Management Functionality', () => {
  const apiUrl = Cypress.env('VITE_API_URL');

  beforeEach(() => {
    cy.request('POST', `${apiUrl}/users/auth/login`, {
      email: 'admin@gmail.com',
      password: 'admin',
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      const token = resp.body.accessToken;
      window.localStorage.setItem('token', token);
      cy.log(`Login successful, token set: ${token}`);
      
      cy.window().then((win) => {
        win.TokenManager = {
          isAuthenticated: () => true,
          getUserRole: () => 'ADMIN'
        };
      });
    });

    cy.visit('/');
    cy.url().should('include', '/');
    cy.contains('All Categories', { timeout: 10000 }).should('be.visible');

    cy.visit('/admindashboard');
    cy.url().should('include', '/admindashboard');
    cy.contains('Category Management', { timeout: 15000 }).should('be.visible');
  });

  it('should display category management page', () => {
    cy.get('h1').should('contain', 'Category Management');
    cy.get('#create-category-button').should('be.visible');
  });

  it('should show modal to create new category', () => {
    cy.get('#create-category-button').click();
    cy.get('.fixed').should('be.visible');
    cy.get('h2').should('contain', 'Create New Category');
  });

  it('should show error for empty category name', () => {
    cy.get('#create-category-button').click();
    cy.get('#create-category-submit-button').click();
    cy.get('.text-red-500').should('contain', 'Category name cannot be empty');
  });

  it('should create a new category successfully', () => {
    cy.get('#create-category-button').click();
    cy.get('#category-name-input').type('New Category');
    cy.get('#add-attribute-button').click();
    cy.get('input[name="name"]').last().type('Attribute1');

    cy.intercept('POST', `${apiUrl}/categories`, {
      statusCode: 200,
      body: {
        id: 'new-category-id',
        name: 'New Category',
        attributes: [{ name: 'Attribute1' }],
      },
    }).as('createCategoryRequest');

    cy.get('#create-category-submit-button').click();
    cy.wait('@createCategoryRequest').its('response.statusCode').should('eq', 200);
    cy.get('.toast').should('contain', 'Category created successfully!');
    cy.get('.bg-gray-100').should('contain', 'New Category');
  });
});






