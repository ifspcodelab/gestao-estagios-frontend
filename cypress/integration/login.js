describe('Login', () => {
  it('login success', () => {
    cy.visit('http://localhost:4200/authentication/login');
    cy.get('input[name="registration"]').type("SP0000000");
    cy.get('input[name="password"]').type("Senha1234");
    cy.get('[data-test=button-login]').click();
    cy.url().should('contain', '/admin');
  })

  it('login invalid credentials', () => {
    cy.visit('http://localhost:4200/authentication/login');
    cy.get('input[name="registration"]').type("SP010101");
    cy.get('input[name="password"]').type("Senha1234");
    cy.get('[data-test=button-login]').click();
    cy.get('mat-error').should('have.text', ' Usuário inválido. Informe credenciais corretas e tente novamente. ')
  })

  it('display error in empty registration', () => {
    cy.visit('http://localhost:4200/authentication/login');
    cy.get('input[name="password"]').type("Senha1234");
    cy.get('[data-test=button-login]').click();
    cy.get('mat-error').should('have.text', 'Matricula é obrigatória');
  })

  it('display error in empty password', () => {
    cy.visit('http://localhost:4200/authentication/login');
    cy.get('input[name="registration"]').type("SP0000000");
    cy.get('[data-test=button-login]').click();
    cy.get('mat-error').should('have.text', 'Senha é obrigatória');
  })



})
