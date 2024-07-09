import { test, expect } from "@playwright/test";

test("pantry should redirect actors to login if they are not logged in", async ({
  page,
}) => {
  await page.goto("/app/pantry");
  //   await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole("button", { name: /log in/i })).toBeVisible();
});
