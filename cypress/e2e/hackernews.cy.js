import * as faker from '@faker-js/faker'

const initialTerm = 'redux'
const newTerm = 'cypress'
const options = { env: { snapshotOnly: true } }

describe('Testing application Hacker News', options, () => {
    let firstApiResponse

    beforeEach(() => {
       cy.request(`/api/v1/search?query=${initialTerm}&page=0&hitsPerPage=100`)
         .then((response) => {
            firstApiResponse = response
        })

        cy.visit('/')
    })

    context('when aplication hit API', options, () => {
    
        it('check home page have 100 itens', options, () => {
            cy.get('.button-inline')
              .should('be.visible')
              .should('contain', 'Title')
              .should('contain', 'Author')
              .should('contain', 'Comments')
              .should('contain', 'Points')

            cy.get('.table-row')
              .should('be.length', 100)
        })

        it('shoud be use cache after first seach', () => {
            cy.request(`/api/v1/search?query=${initialTerm}&page=0&hitsPerPage=4`)
              .then((secondResponse) => {
                expect(secondResponse.duration).to.be.lessThan(100)
                expect(secondResponse.body).to.deep.equal(firstApiResponse.body)
            })
        })

        it('shows 100 stories, then the next 200 after clicking "More"', () => {
            cy.get('.table-row')
            .should('be.length', 100)

            cy.contains('More')
              .should('be.visible')
              .click()    

            cy.get('.table-row')
              .should('be.length', 200)
        })
    })

    context('Testing API with mocking results', () => {
        beforeEach(() => {
            cy.intercept(
                '**/search?query=redux&page=0&hitsPerPage=100',
                { fixture: 'empty' }
            ).as('empty')

            cy.intercept(
                `**/search?query=${newTerm}&page=0&hitsPerPage=100`,
                { fixture: 'stories' }
            ).as('stories')

            cy.visit('/')
            cy.wait('@empty')
        })

        it('types and hit ENTER', () => {
            cy.get('input')
              .clear()
              .type(`${newTerm}{enter}`)
            
              cy.wait('@stories')
        })
        
        it('Archive Stories', () => {
            cy.get('input')
              .clear()
              .type(`${newTerm}{enter}`)
                
            cy.wait('@stories')

            cy.get('.table-row')
              .should('be.visible')
              .should('have.length', 2)

            cy.contains('Dismiss')
              .click()

            cy.get('.table-row')
              .should('be.visible')
              .should('have.length', 1)
            
        })

        context('Order By', () => {
          const stories = require('../fixtures/stories')

        it('list stories', () => {
            cy.search(newTerm)
            cy.wait('@stories')

            cy.get('.table-row')
              .should('be.visible')
              .first()
              .should('contain', stories.hits[0].title)
              .and('contain', stories.hits[0].author)
              .and('contain', stories.hits[0].points)
              .and('contain', stories.hits[0].num_comments)

            cy.get('.table-row')
              .last()
              .should('contain', stories.hits[1].title)
              .and('contain', stories.hits[1].author)
              .and('contain', stories.hits[1].points)
              .and('contain', stories.hits[1].num_comments)
        })

        it('order by title', () => {
            cy.search(newTerm)
            cy.wait('@stories')

            cy.contains('Title').click()
            cy.contains('Title').click()

            cy.get('.table-row')
              .should('be.visible')
              .first()
              .should('contain', stories.hits[1].title)
              .should('contain', stories.hits[1].author)
              .should('contain', stories.hits[1].points)
              .should('contain', stories.hits[1].num_comments)

            cy.get('.table-row')
              .last()
              .should('contain', stories.hits[0].title)
              .should('contain', stories.hits[0].author)
              .should('contain', stories.hits[0].points)
              .should('contain', stories.hits[0].num_comments)
        })

        it('order by Author', () => {
            cy.search(newTerm)
            cy.wait('@stories')

            cy.contains('Author').click()
            cy.contains('Author').click()

            cy.get('.table-row')
              .first()
              .should('contain', stories.hits[1].title)
              .should('contain', stories.hits[1].author)
              .should('contain', stories.hits[1].points)
              .should('contain', stories.hits[1].num_comments)

            cy.get('.table-row')
              .last()
              .should('contain', stories.hits[0].title)
              .should('contain', stories.hits[0].author)
              .should('contain', stories.hits[0].points)
              .should('contain', stories.hits[0].num_comments)
        })

        it('order by Comments', () => {
            cy.search(newTerm)
            cy.wait('@stories')

            cy.contains('Comments').click()

            cy.get('.table-row')
              .first()
              .should('contain', stories.hits[1].title)
              .should('contain', stories.hits[1].author)
              .should('contain', stories.hits[1].points)
              .should('contain', stories.hits[1].num_comments)

            cy.get('.table-row')
              .last()
              .should('contain', stories.hits[0].title)
              .should('contain', stories.hits[0].author)
              .should('contain', stories.hits[0].points)
              .should('contain', stories.hits[0].num_comments)
        })

        it('order by Points', () => {
            cy.search(newTerm)
            cy.wait('@stories')

            cy.contains('Points').click()

            cy.get('.table-row')
              .first()
              .should('contain', stories.hits[1].title)
              .should('contain', stories.hits[1].author)
              .should('contain', stories.hits[1].points)
              .should('contain', stories.hits[1].num_comments)

            cy.get('.table-row')
              .last()
              .should('contain', stories.hits[0].title)
              .should('contain', stories.hits[0].author)
              .should('contain', stories.hits[0].points)
              .should('contain', stories.hits[0].num_comments)
        })
        })
    })
})