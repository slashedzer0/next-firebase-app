import { test, expect } from '@playwright/test';

test('TC-29', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('admin@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
  await page.getByRole('button', { name: 'Toggle password visibility' }).click();
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page.getByRole('navigation')).toContainText('Dashboard', { timeout: 10000 });
  await page.getByRole('link', { name: 'Dashboard' }).click();
  await expect(page.getByText('Overview', { exact: true })).toBeVisible();
});

test('TC-30', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('admin@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
  await page.getByRole('button', { name: 'Toggle password visibility' }).click();
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page.getByRole('navigation')).toContainText('Dashboard', { timeout: 10000 });
  await page.getByRole('link', { name: 'Scan Reports' }).click();
  await expect(page.getByText('Actions', { exact: true })).toBeVisible();
});

test('TC-31', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('admin@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
  await page.getByRole('button', { name: 'Toggle password visibility' }).click();
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page.getByRole('navigation')).toContainText('Dashboard', { timeout: 10000 });
  await page.getByRole('link', { name: 'Scan Reports' }).click();
  await expect(page.getByText('Actions', { exact: true })).toBeVisible();
  await page.getByRole('row').getByRole('button').first().click();
  await expect(page.getByText('Student Details', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Student Details')).toContainText('Email');
  await expect(page.getByLabel('Student Details')).toContainText('NIM');
  await expect(page.getByLabel('Student Details')).toContainText('Phone');
  await page.getByRole('button', { name: 'Close' }).click();
});

test('TC-32', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('admin@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
  await page.getByRole('button', { name: 'Toggle password visibility' }).click();
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page.getByRole('navigation')).toContainText('Dashboard', { timeout: 10000 });
  await page.getByRole('link', { name: 'Scan Reports' }).click();
  await expect(page.getByText('Actions', { exact: true })).toBeVisible();
  await page.getByRole('row').getByRole('button').nth(1).click();
  await expect(page.getByText('Are you absolutely sure?', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.getByRole('region').getByRole('listitem')).toBeVisible();
});

test('TC-33', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('admin@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
  await page.getByRole('button', { name: 'Toggle password visibility' }).click();
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page.getByRole('navigation')).toContainText('Dashboard', { timeout: 10000 });
  await page.getByRole('link', { name: 'Users' }).click();
  await expect(page.getByText('Actions', { exact: true })).toBeVisible();
});

test('TC-34', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('admin@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
  await page.getByRole('button', { name: 'Toggle password visibility' }).click();
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page.getByRole('navigation')).toContainText('Dashboard', { timeout: 10000 });
  await page.getByRole('link', { name: 'Users' }).click();
  await expect(page.getByText('Actions', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Copy email address' }).first().click();
  await expect(page.getByRole('region').getByRole('listitem')).toBeVisible();
});

test('TC-35', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('admin@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
  await page.getByRole('button', { name: 'Toggle password visibility' }).click();
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page.getByRole('navigation')).toContainText('Dashboard', { timeout: 10000 });
  await page.getByRole('link', { name: 'Users' }).click();
  await expect(page.getByText('Actions', { exact: true })).toBeVisible();
  await page.getByRole('row').getByRole('button').nth(1).click();
  await expect(page.getByText('Are you absolutely sure?', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Delete account', exact: true }).click();
  await expect(page.getByRole('region').getByRole('listitem')).toBeVisible();
});
