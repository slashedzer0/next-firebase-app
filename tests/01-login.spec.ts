import { test, expect } from '@playwright/test';

test('TC-01', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('student@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('password');
  await page.getByRole('button', { name: 'Toggle password visibility' }).click();
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page.getByRole('navigation')).toContainText('Dashboard', { timeout: 10000 });
});

test('TC-02', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('button', { name: 'Log in with Google', exact: true }).click();
  await expect(page.getByRole('navigation')).toContainText('Dashboard', { timeout: 10000 });
});

test('TC-03', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('student@email.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('wordpass');
  await page.getByRole('button', { name: 'Toggle password visibility' }).click();
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page.getByRole('listitem').first()).toBeVisible();
});

test('TC-04', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('student@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('ngawur123');
  await page.getByRole('button', { name: 'Toggle password visibility' }).click();
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page.getByRole('listitem').first()).toBeVisible();
});

test('TC-05', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('name@example.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('wordpass');
  await page.getByRole('button', { name: 'Toggle password visibility' }).click();
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page.getByRole('listitem').first()).toBeVisible();
});
