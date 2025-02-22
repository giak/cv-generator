import { render, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import { createTestingPinia } from "@pinia/testing";
import App from "../App.vue";

describe("App.vue", () => {
  it("should render the CV Generator title", () => {
    render(App, {
      global: {
        plugins: [createTestingPinia()],
      },
    });
    expect(screen.getByText("CV Generator")).toBeInTheDocument();
  });

  it("should render the subtitle", () => {
    render(App, {
      global: {
        plugins: [createTestingPinia()],
      },
    });
    expect(screen.getByText("Build your professional CV")).toBeInTheDocument();
  });

  it("should render the ResumeForm component", () => {
    render(App, {
      global: {
        plugins: [createTestingPinia()],
      },
    });
    expect(document.querySelector("main")).toBeInTheDocument();
    expect(document.querySelector(".min-h-screen")).toBeInTheDocument();
  });
});
