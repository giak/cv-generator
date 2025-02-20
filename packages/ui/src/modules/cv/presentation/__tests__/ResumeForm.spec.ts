import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import ResumeForm from "../components/ResumeForm.vue";

describe("ResumeForm.vue", () => {
  it("should render empty state when no data", () => {
    const wrapper = mount(ResumeForm, {
      global: {
        plugins: [createTestingPinia()],
      },
    });

    expect(wrapper.find('[data-test="empty-state"]').exists()).toBe(true);
  });

  it("should emit save event with valid data", async () => {
    const wrapper = mount(ResumeForm, {
      global: {
        plugins: [createTestingPinia()],
      },
    });

    await wrapper.find('[data-test="name-input"]').setValue("John Doe");
    await wrapper.find('[data-test="email-input"]').setValue("john@example.com");
    await wrapper.find("form").trigger("submit");

    expect(wrapper.emitted("save")).toBeTruthy();
    expect(wrapper.emitted("save")[0][0]).toEqual({
      basics: {
        name: "John Doe",
        email: "john@example.com",
      },
    });
  });
});
