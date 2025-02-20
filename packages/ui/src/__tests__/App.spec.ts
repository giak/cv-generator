import { render, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import App from "../App.vue";

describe("App.vue", () => {
  it("should render the CV Generator title", () => {
    render(App);
    expect(screen.getByText("CV Generator")).toBeInTheDocument();
  });

  it("should render the subtitle", () => {
    render(App);
    expect(screen.getByText("Build your professional CV")).toBeInTheDocument();
  });

  it("should render the ResumeForm component", () => {
    render(App);
    expect(document.querySelector("main")).toBeInTheDocument();
    expect(document.querySelector(".min-h-screen")).toBeInTheDocument();
  });
});
