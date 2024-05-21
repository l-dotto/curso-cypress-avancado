
const options = { env: { snapshotOnly: true } }

describe('Hacker Stories', options, () => {
  beforeEach(() => {
    const newTerm = 'React'
    cy.api_hackersStories(newTerm, 0).as('getStories')
  
    cy.visit('/')
    cy.wait('@getStories')
    cy.contains('More').should('be.visible')
  })

  it('shows the footer', () => {
    cy.get('footer')
      .should('be.visible')
      .and('contain', 'Icons made by Freepik from www.flaticon.com')
  })

  context('List of stories', () => {
    // Since the API is external,
    // I can't control what it will provide to the frontend,
    // and so, how can I assert on the data?
    // This is why this test is being skipped.
    // TODO: Find a way to test it out.
    it.skip('shows the right data for all rendered stories', () => {})

    it('shows 20 stories, then the next 20 after clicking "More"', () => {

      cy.api_hackersStories('React', '1').as('getNextPage')

      cy.get('.item').should('have.length', 20)
      cy.contains('More').click()

      cy.wait('@getNextPage')

      cy.get('.item').should('have.length', 40)
    })

    it('shows only nineteen stories after dimissing the first story', () => {
      cy.get('.button-small')
        .first()
        .click()

      cy.get('.item').should('have.length', 19)
    })

    // Since the API is external,
    // I can't control what it will provide to the frontend,
    // and so, how can I test ordering?
    // This is why these tests are being skipped.
    // TODO: Find a way to test them out.
    context.skip('Order by', () => {
      it('orders by title', () => {})

      it('orders by author', () => {})

      it('orders by comments', () => {})

      it('orders by points', () => {})
    })

    // Hrm, how would I simulate such errors?
    // Since I still don't know, the tests are being skipped.
    // TODO: Find a way to test them out.
    context.skip('Errors', () => {
      it('shows "Something went wrong ..." in case of a server error', () => {})

      it('shows "Something went wrong ..." in case of a network error', () => {})
    })
  })

  context('Search', () => {
    const initialTerm = 'React'
    const newTerm = 'Cypress'

    beforeEach(() => {
      cy.get('#search')
        .clear()
    })

    it('types and hits ENTER', () => {

      cy.api_hackersStories(newTerm, 0).as('getEnterStories')

      cy.get('#search')
        .type(`${newTerm}{enter}`)
      cy.wait('@getEnterStories')

      cy.get('.item').should('have.length', 20)
      cy.get('.item')
        .first()
        .should('contain', newTerm)
      cy.get(`button:contains(${initialTerm})`)
        .should('be.visible')
    })

    it('types and clicks the submit button', () => {
      cy.api_hackersStories(newTerm, 0).as('getClickStories')

      cy.get('#search')
        .type(newTerm)
      cy.contains('Submit')
        .click()
      cy.wait('@getClickStories')

      cy.get('.item').should('have.length', 20)
      cy.get('.item')
        .first()
        .should('contain', newTerm)
      cy.get(`button:contains(${initialTerm})`)
        .should('be.visible')
    })

    context('Last searches', () => {
      it('searches via the last searched term', () => {
        cy.api_hackersStories(newTerm, 0).as('getNewTerm')
        cy.get('#search')
          .type(`${newTerm}{enter}`)

        cy.wait('@getNewTerm')

        cy.api_hackersStories(initialTerm, 0).as('getInitialTerm')
        cy.get(`button:contains(${initialTerm})`)
          .should('be.visible')
          .click()

        cy.wait('@getInitialTerm')

        cy.get('.item').should('have.length', 20)
        cy.get('.item')
          .first()
          .should('contain', initialTerm)
        cy.get(`button:contains(${newTerm})`)
          .should('be.visible')
      })

      it('shows a max of 5 buttons for the last searched terms', options, () => {
        const faker = require('faker')
        cy.api_hackersStories('*', 0).as('getMaxButtons')

        Cypress._.times(6, () => {
          cy.get('#search')
            .clear()
            .type(`${faker.random.words()}{enter}`)
          cy.wait('@getMaxButtons')
        })

        cy.get('.last-searches button')
          .should('have.length', 5)
      })    
    })
})
})

context('Request errors', () => {
  const newTerm = 'React'
  it('Show error when network fails', () => {
    // Simula o erro de rede
    cy.err_api_hackersStories(newTerm, 0).as('getNetworkError')
    cy.visit('/')
    cy.get('#search')
      .clear()
      .type(`${newTerm}{enter}`)
    cy.wait('@getNetworkError')
    cy.contains('Something went wrong')
      .should('be.visible')
  })
})