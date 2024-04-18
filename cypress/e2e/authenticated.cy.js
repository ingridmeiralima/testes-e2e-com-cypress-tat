/* eslint-disable linebreak-style */

import { faker } from '@faker-js/faker/locale/en'

describe('Scenarios where authentication is a pre-condition', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/notes').as('getNotes')
    cy.sessionLogin()
  })

  it('CRUDs a note', () => {
    const noteDescription = faker.lorem.words(4)

    cy.createNote(noteDescription)
    cy.wait('@getNotes')

    const updatedNoteDescription = faker.lorem.words(4)
    const attachFile = true

    cy.editNote(noteDescription, updatedNoteDescription, attachFile)
    cy.wait('@getNotes')

    cy.deleteNote(updatedNoteDescription)
    cy.wait('@getNotes')
  })

  it('successfully submits the settings form', () => {
    cy.intercept('POST', '**/prod/billing').as('paymentRequest')

    cy.fillSettingsFormAndSubmit()

    cy.wait('@getNotes')
    cy.wait('@paymentRequest')
      .its('state')
      .should('be.equal', 'Complete')
  })
  it('logs out', () => {
    cy.visit('/')
    cy.wait('@getNotes')
    //se a largura do viewport for menor que o breakpoint
    if (Cypress.config('viewportWidth') < Cypress.env('viewportWidthBreakpoint')) {//Cypress.env é o env(enviroment) definido em cypress.config.js
      cy.get('.navbar-toggle.collapsed')
        .should('be.visible')
        .click()
    }
    cy.contains('.nav a', 'Logout').click()//encontra o link (a) que está dentro da classe nav que tem o texto Logout
    cy.get('#email').should('be.visible')
  })
})
