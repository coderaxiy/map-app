/// <reference types="cypress" />

describe("Leaflet Map Tests", () => {
  beforeEach(() => {
    // Visit the page where the map is rendered
    cy.visit("/");
  });

  it("should load the map with markers", () => {
    // Check if the map container exists
    cy.get(".leaflet-container").should("be.visible");

    // Check if markers are loaded (assuming marker class is 'leaflet-marker-icon')
    cy.get(".leaflet-marker-icon").should("have.length.at.least", 1);
  });

  it("should open popup when marker is clicked", () => {
    // Click on the first marker
    cy.get(".leaflet-marker-icon").first().click();

    // Check if the popup contains the correct text
    cy.get(".leaflet-popup-content").within(() => {
      cy.contains("Status").should("exist");
      cy.contains("Comment").should("exist");
    });

    // Click on the 'Edit' button to open the modal
    cy.contains("button", "Edit").click();

    // Check if the modal is open
    cy.get(".ant-modal").should("be.visible");
  });

  it("should update status and comment in the modal", () => {
    // Click on the first marker and open modal
    cy.get(".leaflet-marker-icon").first().click();
    cy.contains("button", "Edit").click();

    // Update the form inside the modal
    cy.get('input[name="status"]').check(); // Check the checkbox
    cy.get('textarea[name="details"]').clear().type("Updated Comment"); // Update the textarea

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Ensure the modal closes after submission
    cy.get(".ant-modal").should("not.exist");

    // Check if the popup has updated values
    cy.get(".leaflet-marker-icon").first().click();
    cy.get(".leaflet-popup-content").within(() => {
      cy.contains("Status: active").should("exist");
      cy.contains("Updated Comment").should("exist");
    });
  });
});
