import { defineConfig } from "cypress";

export default defineConfig({
	component: {
		devServer: {
			framework: "next",
			bundler: "webpack",
		},
		specPattern: "components/**/*.cy.{ts,tsx}",
	},

	e2e: {
		baseUrl: "http://localhost:3000",
		specPattern: "cypress/e2e/**/*.cy.{ts,tsx}",
		screenshotOnRunFailure: false, // optional, this can be enabled if screenshots are desired
		setupNodeEvents(on, config) {
			// implement node event listeners here
		},
	},
});
