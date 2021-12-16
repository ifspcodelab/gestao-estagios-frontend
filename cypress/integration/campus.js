describe('Campus', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/authentication/login');
    cy.get('input[name="registration"]').type("SP0000000");
    cy.get('input[name="password"]').type("Senha1234");
    cy.get('[data-test=button-login]').click();
    cy.url().should('contain', '/admin');
  });

  it('empty state', () => {
    cy.visit('http://localhost:4200/admin/campus');
  });

  it('create a new campus', () => {
    cy.visit('http://localhost:4200/admin/campus/create');
  });
});
