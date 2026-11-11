describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
  })
})

// visit a page
describe('Navigation', () => {
  
  it('should navigate to the events page via navbar', () => {
    cy.visit('http://localhost:3000/')
    // clicks navigation link
    cy.get('[href*="events"]').click()

    // browser URL updates to the targeted path
    cy.url().should('include', '/events')

    // targed page renders correctly
    cy.get('h1').should('contain', 'Events')
  })

  it('should navigate to the jobs page via navbar', () => {
    cy.visit('http://localhost:3000/')
    cy.get('[href*="jobs"]').click()
    cy.url().should('include', '/jobs')
    cy.get('h1').should('contain', 'Jobs')
  })
})