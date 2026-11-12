import React from 'react'
import ChatShell from './chat-shell'
import ChatBox from './chatbox'
import ChatPopUp from './chat-popup'

describe('Chat Shell', () => {
  it('when the maximize button is clicked, the chatbox should open', () => {
    const onOpenSpy = cy.spy().as('onOpenSpy')
    cy.mount(<ChatShell />)
    cy.mount(<ChatPopUp maximize={onOpenSpy}/>)
    cy.get('button').click()
    cy.get('@onOpenSpy').should('have.been.calledWith', true)
  })
  it('when the minimize button is clicked, the chatbox should close', () => {
    const onOpenSpy = cy.spy().as('onOpenSpy')
    cy.mount(<ChatShell />)
    cy.mount(<ChatBox minimize={onOpenSpy}/>)
    cy.get('button').click()
    cy.get('@onOpenSpy').should('have.been.calledWith', false)
  })
})