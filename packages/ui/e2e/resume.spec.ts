import { expect, test } from "@playwright/test";

test("should create a new resume", async ({ page }) => {
  await page.goto("/");

  // Fill in basic information
  await page.getByTestId("name-input").fill("John Doe");
  await page.getByTestId("email-input").fill("john@example.com");

  // Submit the form
  await page.getByRole("button", { name: "Save" }).click();

  // Verify the resume was created
  await expect(page.getByTestId("resume-preview")).toBeVisible();
  await expect(page.getByText("John Doe")).toBeVisible();
  await expect(page.getByText("john@example.com")).toBeVisible();
});

test("should validate required fields", async ({ page }) => {
  await page.goto("/");

  // Try to submit without required fields
  await page.getByRole("button", { name: "Save" }).click();

  // Verify validation messages
  await expect(page.getByText("Name is required")).toBeVisible();
  await expect(page.getByText("Email is required")).toBeVisible();
});
