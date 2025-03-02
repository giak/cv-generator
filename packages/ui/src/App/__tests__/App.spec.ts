import { render, screen } from "@testing-library/vue"
import { describe, expect, it } from "vitest"
import { createTestingPinia } from "@pinia/testing"
import App from "../App.vue"

describe("App.vue", () => {
  it("should render the CV Generator title", () => {
    render(App, {
      global: {
        plugins: [createTestingPinia()],
      },
    })
    const titleElements = screen.getAllByText("CV Generator")
    expect(titleElements.length).toBeGreaterThan(0)
    expect(titleElements[0]).toBeInTheDocument()
  })

  it("should render the dashboard layout", () => {
    render(App, {
      global: {
        plugins: [createTestingPinia()],
      },
    })
    expect(document.querySelector(".dashboard")).toBeInTheDocument()
  })

  it("should render the ResumeForm component", () => {
    render(App, {
      global: {
        plugins: [createTestingPinia()],
      },
    })
    expect(document.querySelector("main")).toBeInTheDocument()
    expect(document.querySelector(".min-h-screen")).toBeInTheDocument()
  })
}) 