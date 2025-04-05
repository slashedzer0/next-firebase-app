import { test, expect } from '@playwright/test';

test('TC-12', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'How it works' }).click();
  await page.getByRole('button', { name: 'Scan Now' }).click();
  await page
    .locator('div')
    .filter({ hasText: /^Strongly disagree$/ })
    .click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page
    .locator('div')
    .filter({ hasText: /^Disagree$/ })
    .click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page
    .locator('div')
    .filter({ hasText: /^Neutral$/ })
    .click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page
    .locator('div')
    .filter({ hasText: /^Agree$/ })
    .click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page
    .locator('div')
    .filter({ hasText: /^Strongly agree$/ })
    .click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page
    .locator('div')
    .filter({ hasText: /^Agree$/ })
    .click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page
    .locator('div')
    .filter({ hasText: /^Neutral$/ })
    .click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page
    .locator('div')
    .filter({ hasText: /^Disagree$/ })
    .click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page
    .locator('div')
    .filter({ hasText: /^Strongly disagree$/ })
    .click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page
    .locator('div')
    .filter({ hasText: /^Disagree$/ })
    .click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByText('Scan Complete')).toBeVisible({
    timeout: 10000,
  });
});

test('TC-13', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('student@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('password');
  await page.getByRole('button', { name: 'Toggle password visibility' }).click();
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Start Scan' }).click();
  const page1 = await page1Promise;
  await page1.getByRole('button', { name: 'Scan Now' }).click();
  await page1
    .locator('div')
    .filter({ hasText: /^Strongly agree$/ })
    .click();
  await page1.getByRole('button', { name: 'Next', exact: true }).click();
  await page1
    .locator('div')
    .filter({ hasText: /^Agree$/ })
    .click();
  await page1.getByRole('button', { name: 'Next', exact: true }).click();
  await page1
    .locator('div')
    .filter({ hasText: /^Neutral$/ })
    .click();
  await page1.getByRole('button', { name: 'Next', exact: true }).click();
  await page1
    .locator('div')
    .filter({ hasText: /^Disagree$/ })
    .click();
  await page1.getByRole('button', { name: 'Next', exact: true }).click();
  await page1
    .locator('div')
    .filter({ hasText: /^Strongly disagree$/ })
    .click();
  await page1.getByRole('button', { name: 'Next', exact: true }).click();
  await page1
    .locator('div')
    .filter({ hasText: /^Disagree$/ })
    .click();
  await page1.getByRole('button', { name: 'Next', exact: true }).click();
  await page1
    .locator('div')
    .filter({ hasText: /^Neutral$/ })
    .click();
  await page1.getByRole('button', { name: 'Next', exact: true }).click();
  await page1
    .locator('div')
    .filter({ hasText: /^Agree$/ })
    .click();
  await page1.getByRole('button', { name: 'Next', exact: true }).click();
  await page1
    .locator('div')
    .filter({ hasText: /^Strongly agree$/ })
    .click();
  await page1.getByRole('button', { name: 'Next', exact: true }).click();
  await page1
    .locator('div')
    .filter({ hasText: /^Agree$/ })
    .click();
  await page1.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page1.getByText('Scan Complete')).toBeVisible({
    timeout: 10000,
  });
});

test('TC-14', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('student@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('password');
  await page.getByRole('button', { name: 'Toggle password visibility' }).click();
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Start Scan' }).click();
  const page1 = await page1Promise;
  await page1.getByRole('button', { name: 'Scan Now' }).click();
  await page1
    .locator('div')
    .filter({ hasText: /^Strongly agree$/ })
    .click();
  await page1.getByRole('button', { name: 'Next', exact: true }).click();
  await page1
    .locator('div')
    .filter({ hasText: /^Agree$/ })
    .click();
  await page1.getByRole('button', { name: 'Next', exact: true }).click();
  await page1
    .locator('div')
    .filter({ hasText: /^Neutral$/ })
    .click();
  await page1.getByRole('button', { name: 'Next', exact: true }).click();
  await page1
    .locator('div')
    .filter({ hasText: /^Disagree$/ })
    .click();
  await page1.getByRole('button', { name: 'Next', exact: true }).click();
  await page1
    .locator('div')
    .filter({ hasText: /^Strongly disagree$/ })
    .click();
  await page1.getByRole('button', { name: 'Next', exact: true }).click();
  await page1
    .locator('div')
    .filter({ hasText: /^Disagree$/ })
    .click();
  await page1.getByRole('button', { name: 'Next', exact: true }).click();
  await page1
    .locator('div')
    .filter({ hasText: /^Neutral$/ })
    .click();
  await page1.getByRole('button', { name: 'Next', exact: true }).click();
  await page1
    .locator('div')
    .filter({ hasText: /^Agree$/ })
    .click();
  await page1.getByRole('button', { name: 'Next', exact: true }).click();
  await page1
    .locator('div')
    .filter({ hasText: /^Strongly agree$/ })
    .click();
  await page1.getByRole('button', { name: 'Next', exact: true }).click();
  await page1
    .locator('div')
    .filter({ hasText: /^Agree$/ })
    .click();
  await page1.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page1.getByText('Scan Complete')).toBeVisible({
    timeout: 10000,
  });
  await page1.getByRole('button', { name: 'Save Result' }).click();
  await expect(page1.getByRole('listitem').first()).toBeVisible();
});
