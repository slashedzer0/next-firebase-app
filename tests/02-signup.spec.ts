import { test, expect } from '@playwright/test';

test('TC-06', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('link', { name: 'Sign up' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill('Mike Wazowski');
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('wazowski@monsterinc.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('wazowski123');
  await page.getByRole('button', { name: 'Toggle password visibility' }).click();
  await page.getByRole('button', { name: 'Sign up', exact: true }).click();
  await expect(page.getByRole('listitem').first()).toBeVisible();
  await expect(page.getByRole('navigation')).toContainText('Dashboard', { timeout: 10000 });
});

test('TC-07', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('link', { name: 'Sign up' }).click();
  await page.getByRole('button', { name: 'Sign up with Google', exact: true }).click();
  await expect(page.getByRole('listitem').first()).toBeVisible();
  await expect(page.getByRole('navigation')).toContainText('Dashboard', { timeout: 10000 });
});

test('TC-08', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('link', { name: 'Sign up' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill('asd7516&!@`()');
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('budisantoso@yahoo.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('budi1234');
  await page.getByRole('button', { name: 'Toggle password visibility' }).click();
  await page.getByRole('button', { name: 'Sign up', exact: true }).click();
  await expect(page.getByText('Name can only contain letters and spaces')).toBeVisible({
    timeout: 10000,
  });
});

test('TC-09', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('link', { name: 'Sign up' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill('Thanos');
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('thanos@ganteng');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('thanos02');
  await page.getByRole('button', { name: 'Toggle password visibility' }).click();
  await page.getByRole('button', { name: 'Sign up', exact: true }).click();
  await expect(page.getByText('Please enter a valid email address')).toBeVisible({
    timeout: 10000,
  });
});

test('TC-10', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('link', { name: 'Sign up' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill('Johan Arif');
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('johanarif@outlook.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('123456');
  await page.getByRole('button', { name: 'Toggle password visibility' }).click();
  await page.getByRole('button', { name: 'Sign up', exact: true }).click();
  await expect(page.getByText('Password must be at least 8 characters')).toBeVisible({
    timeout: 10000,
  });
});

test('TC-11', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('link', { name: 'Sign up' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill('asd7516&!@`()');
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('thanos@ganteng');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('123456');
  await page.getByRole('button', { name: 'Toggle password visibility' }).click();
  await page.getByRole('button', { name: 'Sign up', exact: true }).click();
  await expect(page.getByText('Name can only contain letters and spaces')).toBeVisible({
    timeout: 10000,
  });
  await expect(page.getByText('Please enter a valid email address')).toBeVisible({
    timeout: 10000,
  });
  await expect(page.getByText('Password must be at least 8 characters')).toBeVisible({
    timeout: 10000,
  });
});
