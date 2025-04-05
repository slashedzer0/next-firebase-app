import { test, expect } from '@playwright/test';

test('TC-15', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'About', exact: true }).click();
  await expect(page.getByText('About Us', { exact: true })).toBeVisible();
});

test('TC-16', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Support', exact: true }).click();
  await expect(page.getByText('Support', { exact: true })).toBeVisible();
});

test('TC-17', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('student@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('password');
  await page.getByRole('button', { name: 'Toggle password visibility' }).click();
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page.getByRole('navigation')).toContainText('Dashboard', { timeout: 10000 });
  await expect(page.getByRole('button', { name: 'Toggle theme' })).toBeVisible();
  await page.getByRole('button', { name: 'Toggle theme' }).click();
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: 'Toggle theme' }).click();
});

test('TC-18', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('student@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('password');
  await page.getByRole('button', { name: 'Toggle password visibility' }).click();
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page.getByRole('navigation')).toContainText('Dashboard', { timeout: 10000 });
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page.getByText('Welcome back', { exact: true })).toBeVisible();
});
