/// <reference types="cypress" />

describe('LeafletMap with DetailForm Component', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173/');
    });
  
    it('should load the map and display markers', () => {
      cy.get('.leaflet-container').should('exist');
      });
  
    it('should open the edit modal when the Edit button is clicked', () => {
      cy.get('.leaflet-marker-icon').first().click();
  
      cy.get('.leaflet-popup-content button').click();
  
      cy.get('.ant-modal').should('exist');
      cy.get('.ant-modal input[name="details"]').should('have.value', '');
    });
  
    it('should allow editing the marker details', () => {
      cy.get('.leaflet-marker-icon').first().click();
  
      cy.get('.leaflet-popup-content button').click();
  
      cy.get('.ant-modal').should('exist');
  
      cy.get('input[type="checkbox"][name="status"]').check();
  
      cy.get('textarea[name="details"]').clear().type('This is a test comment');
  
      cy.get('form').submit();
  
      cy.get('.ant-modal').should('not.exist');
  
      cy.get('.leaflet-marker-icon').first().click();
  
      cy.get('.leaflet-popup-content').within(() => {
        cy.contains('Status: active');
        cy.contains('Comment: This is a test comment');
      });
    });
  
    it('should persist changes after page refresh', () => {
      cy.get('.leaflet-marker-icon').first().click();
  
      cy.get('.leaflet-popup-content button').click();
  
      cy.get('textarea[name="details"]').clear().type('Persistent comment');
  
      cy.get('form').submit();
  
      cy.reload();
  
      cy.get('.leaflet-marker-icon').first().click();
  
      cy.get('.leaflet-popup-content').within(() => {
        cy.contains('Comment: Persistent comment');
      });
    });
  });
  