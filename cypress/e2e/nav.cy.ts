// replace with actual URL after deployment
const url : string = 'http://localhost:3000'

describe('Navigation', () => {
  beforeEach(() => {
    cy.visit(`${url}`)
  })

  it('should navigate to the events page via navbar', () => {
    // clicks navigation link
    cy.get('[href*="events"]').click()

    // browser URL updates to the targeted path
    cy.url().should('include', '/events')

    // targed page renders correctly
    cy.get('h1').should('contain', 'Events')
  })

  it('should navigate to the jobs page via navbar', () => {
    cy.get('[href*="jobs"]').click()
    cy.url().should('include', '/jobs')
    cy.get('h1').should('contain', 'Jobs')
  })
})