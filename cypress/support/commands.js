import 'cypress-localstorage-commands'

Cypress.Commands.add('assertLoadingIsShownAndHidden', () => {
  cy.contains('Loading ...').should('be.visible')
  cy.contains('Loading ...').should('not.exist')
})

Cypress.Commands.add('api_hackersStories', (newTerm, page) => {
  cy.intercept({
    method: 'GET',
    pathname: '**/search',
    query: {
      query: `${newTerm}`,
      page: `${page}`
    }
  })
})

Cypress.Commands.add('err_api_hackersStories', (newTerm, page) => {
  cy.intercept({
    method: 'GET',
    pathname: '**/search',
    query: {
      query: `${newTerm}`,
      page: `${page}`
    }
  }, { forceNetworkError: true })
})