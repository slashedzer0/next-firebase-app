import { test, expect } from '@playwright/test';

test('TC-19', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('student@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('password');
  await page.getByRole('button', { name: 'Toggle password visibility' }).click();
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page.getByRole('navigation')).toContainText('Dashboard', { timeout: 10000 });
  await page.getByRole('link', { name: 'Dashboard' }).click();
  await expect(page.getByText('Overview', { exact: true })).toBeVisible();
});

test('TC-20', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('student@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('password');
  await page.getByRole('button', { name: 'Toggle password visibility' }).click();
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page.getByRole('navigation')).toContainText('Dashboard', { timeout: 10000 });
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Start Scan' }).click();
  const page1 = await page1Promise;
  await expect(page1.getByText('Stress Assessment', { exact: true })).toBeVisible();
});

test('TC-21', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('student@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('password');
  await page.getByRole('button', { name: 'Toggle password visibility' }).click();
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page.getByRole('navigation')).toContainText('Dashboard', { timeout: 10000 });
  await page.getByRole('link', { name: 'Scan Results' }).click();
  await expect(page.getByText('Confidence', { exact: true })).toBeVisible();
});

test('TC-22', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('student@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('password');
  await page.getByRole('button', { name: 'Toggle password visibility' }).click();
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page.getByRole('navigation')).toContainText('Dashboard', { timeout: 10000 });
  await page.getByRole('link', { name: 'Settings' }).click();
  await expect(page.getByText('First name', { exact: true })).toBeVisible();
  await expect(page.getByText('Last name', { exact: true })).toBeVisible();
  await expect(page.getByText('Email', { exact: true })).toBeVisible();
  await expect(page.getByText('NIM', { exact: true })).toBeVisible();
  await expect(page.getByText('Phone number', { exact: true })).toBeVisible();
});

test('TC-23', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('student@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('password');
  await page.getByRole('button', { name: 'Toggle password visibility' }).click();
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page.getByRole('navigation')).toContainText('Dashboard', { timeout: 10000 });
  await page.getByRole('link', { name: 'Settings' }).click();
  await expect(page.getByText('First name', { exact: true })).toBeVisible();
  await expect(page.getByText('Last name', { exact: true })).toBeVisible();
  await expect(page.getByText('Email', { exact: true })).toBeVisible();
  await expect(page.getByText('NIM', { exact: true })).toBeVisible();
  await expect(page.getByText('Phone number', { exact: true })).toBeVisible();
  await page.getByRole('textbox', { name: 'First name' }).click();
  await page.getByRole('textbox', { name: 'First name' }).fill('John');
  await page.getByRole('textbox', { name: 'Last name' }).click();
  await page.getByRole('textbox', { name: 'Last name' }).fill('Doe');
  await page.getByRole('textbox', { name: 'NIM' }).click();
  await page.getByRole('textbox', { name: 'NIM' }).fill('20000416');
  await page.getByRole('textbox', { name: 'Phone number' }).click();
  await page.getByRole('textbox', { name: 'Phone number' }).fill('081908987447');
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(page.getByRole('listitem').first()).toBeVisible();
});

test('TC-24', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('student@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('password');
  await page.getByRole('button', { name: 'Toggle password visibility' }).click();
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page.getByRole('navigation')).toContainText('Dashboard', { timeout: 10000 });
  await page.getByRole('link', { name: 'Settings' }).click();
  await expect(page.getByText('First name', { exact: true })).toBeVisible();
  await expect(page.getByText('Last name', { exact: true })).toBeVisible();
  await expect(page.getByText('Email', { exact: true })).toBeVisible();
  await expect(page.getByText('NIM', { exact: true })).toBeVisible();
  await expect(page.getByText('Phone number', { exact: true })).toBeVisible();
  await page.getByRole('textbox', { name: 'First name' }).click();
  await page.getByRole('textbox', { name: 'First name' }).fill('John');
  await page.getByRole('textbox', { name: 'Last name' }).click();
  await page.getByRole('textbox', { name: 'Last name' }).fill('');
  await page.getByRole('textbox', { name: 'NIM' }).click();
  await page.getByRole('textbox', { name: 'NIM' }).fill('20000416');
  await page.getByRole('textbox', { name: 'Phone number' }).click();
  await page.getByRole('textbox', { name: 'Phone number' }).fill('081908987447');
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(page.getByRole('listitem').first()).toBeVisible();
});

test('TC-25', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('student@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('password');
  await page.getByRole('button', { name: 'Toggle password visibility' }).click();
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page.getByRole('navigation')).toContainText('Dashboard', { timeout: 10000 });
  await page.getByRole('link', { name: 'Settings' }).click();
  await expect(page.getByText('First name', { exact: true })).toBeVisible();
  await expect(page.getByText('Last name', { exact: true })).toBeVisible();
  await expect(page.getByText('Email', { exact: true })).toBeVisible();
  await expect(page.getByText('NIM', { exact: true })).toBeVisible();
  await expect(page.getByText('Phone number', { exact: true })).toBeVisible();
  await page.getByRole('textbox', { name: 'First name' }).click();
  await page.getByRole('textbox', { name: 'First name' }).fill('1980');
  await page.getByRole('textbox', { name: 'Last name' }).click();
  await page.getByRole('textbox', { name: 'Last name' }).fill('Doe');
  await page.getByRole('textbox', { name: 'NIM' }).click();
  await page.getByRole('textbox', { name: 'NIM' }).fill('20000416');
  await page.getByRole('textbox', { name: 'Phone number' }).click();
  await page.getByRole('textbox', { name: 'Phone number' }).fill('081908987447');
  await expect(
    page.getByText('First name must only contain letters and spaces', { exact: true })
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save changes', exact: true })).toBeDisabled();
});

test('TC-26', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('student@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('password');
  await page.getByRole('button', { name: 'Toggle password visibility' }).click();
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page.getByRole('navigation')).toContainText('Dashboard', { timeout: 10000 });
  await page.getByRole('link', { name: 'Settings' }).click();
  await expect(page.getByText('First name', { exact: true })).toBeVisible();
  await expect(page.getByText('Last name', { exact: true })).toBeVisible();
  await expect(page.getByText('Email', { exact: true })).toBeVisible();
  await expect(page.getByText('NIM', { exact: true })).toBeVisible();
  await expect(page.getByText('Phone number', { exact: true })).toBeVisible();
  await page.getByRole('textbox', { name: 'First name' }).click();
  await page.getByRole('textbox', { name: 'First name' }).fill('John');
  await page.getByRole('textbox', { name: 'Last name' }).click();
  await page.getByRole('textbox', { name: 'Last name' }).fill('Doe');
  await page.getByRole('textbox', { name: 'NIM' }).click();
  await page.getByRole('textbox', { name: 'NIM' }).fill('qwerty123');
  await page.getByRole('textbox', { name: 'Phone number' }).click();
  await page.getByRole('textbox', { name: 'Phone number' }).fill('081908987447');
  await expect(page.getByText('NIM must only contain numbers', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save changes', exact: true })).toBeDisabled();
});

test('TC-27', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('student@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('password');
  await page.getByRole('button', { name: 'Toggle password visibility' }).click();
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page.getByRole('navigation')).toContainText('Dashboard', { timeout: 10000 });
  await page.getByRole('link', { name: 'Settings' }).click();
  await expect(page.getByText('First name', { exact: true })).toBeVisible();
  await expect(page.getByText('Last name', { exact: true })).toBeVisible();
  await expect(page.getByText('Email', { exact: true })).toBeVisible();
  await expect(page.getByText('NIM', { exact: true })).toBeVisible();
  await expect(page.getByText('Phone number', { exact: true })).toBeVisible();
  await page.getByRole('textbox', { name: 'First name' }).click();
  await page.getByRole('textbox', { name: 'First name' }).fill('John');
  await page.getByRole('textbox', { name: 'Last name' }).click();
  await page.getByRole('textbox', { name: 'Last name' }).fill('Doe');
  await page.getByRole('textbox', { name: 'NIM' }).click();
  await page.getByRole('textbox', { name: 'NIM' }).fill('20000416');
  await page.getByRole('textbox', { name: 'Phone number' }).click();
  await page.getByRole('textbox', { name: 'Phone number' }).fill('+6281908987447');
  await expect(
    page.getByText('Phone number must only contain numbers', { exact: true })
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save changes', exact: true })).toBeDisabled();
});

test('TC-28', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('student@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('password');
  await page.getByRole('button', { name: 'Toggle password visibility' }).click();
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page.getByRole('navigation')).toContainText('Dashboard', { timeout: 10000 });
  await page.getByRole('link', { name: 'Settings' }).click();
  await expect(page.getByRole('textbox', { name: 'First name' })).toHaveValue('John');
  await expect(page.getByRole('textbox', { name: 'Last name' })).toHaveValue('Doe');
  await expect(page.getByRole('textbox', { name: 'NIM' })).toHaveValue('20000416');
  await expect(page.getByRole('textbox', { name: 'Phone number' })).toHaveValue('081908987447');
  await page.getByRole('textbox', { name: 'First name' }).click();
  await page.getByRole('textbox', { name: 'First name' }).fill('Burhan');
  await page.getByRole('textbox', { name: 'Last name' }).click();
  await page.getByRole('textbox', { name: 'Last name' }).fill('Anomali');
  await page.getByRole('textbox', { name: 'NIM' }).click();
  await page.getByRole('textbox', { name: 'NIM' }).fill('16042000');
  await page.getByRole('textbox', { name: 'Phone number' }).click();
  await page.getByRole('textbox', { name: 'Phone number' }).fill('+6281908987447');
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'First name' })).toHaveValue('John');
  await expect(page.getByRole('textbox', { name: 'Last name' })).toHaveValue('Doe');
  await expect(page.getByRole('textbox', { name: 'NIM' })).toHaveValue('20000416');
  await expect(page.getByRole('textbox', { name: 'Phone number' })).toHaveValue('081908987447');
});
